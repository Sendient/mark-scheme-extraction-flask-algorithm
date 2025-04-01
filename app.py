from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session
import os
import json
import uuid
import asyncio
import tempfile
from werkzeug.utils import secure_filename
from PIL import Image
import io
import base64
from typing import List, Optional, Dict, Any, Tuple
from dotenv import load_dotenv
from langchain.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import AzureChatOpenAI
from langchain_core.output_parsers import PydanticOutputParser, JsonOutputParser
import PyPDF2
from pdf2image import convert_from_path
from mistralai import Mistral

# Import enums and models from output.py
from static.python.output import (
    ExamBoardEnum,
    QualificationLevelEnum, 
    AIExtractedMarkSchemeModel
)

# Import SubjectEnum from subject.py
from static.python.subjects import SubjectEnum

# Load environment variables
load_dotenv()

# Import prompt template from prompt_lib.py
from static.python.prompt_lib import structured_mark_scheme_extraction_prompt_template

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'pdf'}
app.config['MAX_CONTENT_LENGTH'] = 32 * 1024 * 1024  # 32MB max upload size
app.secret_key = 'summer_cartoon_app'  # For session management

# Azure OpenAI configuration
AZURE_OPENAI_KEY = os.getenv("AZURE_OPENAI_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_VERSION = os.getenv("AZURE_OPENAI_VERSION")
AZURE_OPENAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT")

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Add functions for objective ID handling from the top section
def normalize_value(value):
    """Convert a value to a lower-case, stripped string; return an empty string if None."""
    if value is None:
        return ''
    return value.strip().lower()

def get_lookup_key(norm_subject, ms_qual, norm_objective, ao_lookup):
    """
    Determine the appropriate lookup key for a markscheme objective, considering 
    special handling for AS-Level and A-Level objectives.
    
    Parameters:
        norm_subject   - normalized subject from the markscheme entry
        ms_qual        - normalized markscheme qualification level (e.g. "as-level" or "a-level")
        norm_objective - normalized objective from the markscheme (often without a bracket)
        ao_lookup      - the dictionary of AO entries (to allow a fallback check)
    
    Returns:
        A tuple key to use for looking up the assessment objective.
    """
    # For A-Level/AS-Level subjects, AO entries always have "a-level" for qualification_level.
    if ms_qual in ("as-level", "a-level"):
        target_qual = "a-level"
        # If the objective already includes a bracket, assume it's complete.
        if "(" in norm_objective and ")" in norm_objective:
            candidate_key = (norm_subject, target_qual, norm_objective)
        else:
            # Append the appropriate suffix based on the markscheme qualification level.
            if ms_qual == "as-level":
                candidate_key = (norm_subject, target_qual, norm_objective + " (as)")
            else:  # ms_qual == "a-level"
                candidate_key = (norm_subject, target_qual, norm_objective + " (a level)")
            # If the candidate key is not found in our AO lookup, fall back to using the objective as given.
            if candidate_key not in ao_lookup:
                candidate_key = (norm_subject, target_qual, norm_objective)
        return candidate_key
    else:
        # For non-A-Level subjects (e.g. GCSE, IGCSE), use the qualification level as provided (already normalized).
        return (norm_subject, ms_qual, norm_objective)

def load_assessment_objectives():
    """Load assessment objectives from ao.json and create a lookup dictionary."""
    try:
        with open("ao.json", "r", encoding="utf-8") as ao_file:
            ao_data = json.load(ao_file)

        # Build a lookup dictionary (case insensitive) using subject, qualification_level, and objective.
        ao_lookup = {
            (
                normalize_value(entry.get("subject")),
                normalize_value(entry.get("qualification_level")),
                normalize_value(entry.get("objective"))
            ): entry["_id"]
            for entry in ao_data
        }
        return ao_lookup
    except Exception as e:
        print(f"Error loading assessment objectives: {e}")
        return {}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def process_pdf_with_mistral(pdf_path):
    """
    Process a PDF file using Mistral OCR to extract mark schemes.
    
    Args:
        pdf_path: Path to the PDF file
        
    Returns:
        List of extracted mark schemes
    """
    if not MISTRAL_API_KEY:
        print("Mistral API key not available")
        return []
    
    try:
        client = Mistral(api_key=MISTRAL_API_KEY)
        
        with open(pdf_path, "rb") as f:
            pdf_content = f.read()
        
        file_name = os.path.basename(pdf_path)
        
        uploaded_file = client.files.upload(
            file={
                "file_name": file_name,
                "content": pdf_content,
            },
            purpose="ocr"
        )
        
        mark_schemes = []
        
        messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "How many separate mark schemes are in this document? Just provide a number."
                    },
                    {
                        "type": "document_url",
                        "document_url": uploaded_file.id
                    }
                ]
            }
        ]
        
        response = client.chat.complete(
            model="mistral-large-2-2024-04-01",
            messages=messages
        )
        
        try:
            num_mark_schemes = int(response.choices[0].message.content.strip())
        except (ValueError, IndexError):
            num_mark_schemes = 1
        
        print(f"Detected {num_mark_schemes} mark schemes in the document")
        
        for i in range(num_mark_schemes):
            prompt = f"""
            Extract mark scheme #{i+1} from this document. 
            
            A mark scheme has these components:
            1. Assessment objectives (AO1, AO2, etc.)
            2. Levels (usually 1-4 or 0-4)
            3. Mark bounds for each level
            4. Skills descriptors for each level
            5. Indicative standard examples
            6. Subject, qualification level, and exam board
            
            Format the output as a JSON object matching this structure:
            {JsonOutputParser(pydantic_object=AIExtractedMarkSchemeModel).get_format_instructions()}
            """
            
            messages = [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        },
                        {
                            "type": "document_url",
                            "document_url": uploaded_file.id
                        }
                    ]
                }
            ]
            
            response = client.chat.complete(
                model="mistral-large-2-2024-04-01",
                messages=messages
            )
            
            try:
                mark_scheme_text = response.choices[0].message.content
                if "```json" in mark_scheme_text:
                    mark_scheme_text = mark_scheme_text.split("```json")[1].split("```")[0].strip()
                elif "```" in mark_scheme_text:
                    mark_scheme_text = mark_scheme_text.split("```")[1].split("```")[0].strip()
                
                mark_scheme_data = json.loads(mark_scheme_text)
                mark_schemes.append(mark_scheme_data)
            except Exception as e:
                print(f"Error parsing mark scheme #{i+1}: {e}")
                continue
        
        return mark_schemes
    except Exception as e:
        print(f"Error processing PDF with Mistral: {e}")
        import traceback
        traceback.print_exc()
        return []

def stitch_images(files, output_path=None):
    """
    Stitch images vertically with consistent width.
    
    Args:
        files: List of file paths
        output_path: Optional path to save the stitched image
        
    Returns:
        BytesIO object containing the stitched image
    """
    if not files:
        return None
    
    # Load images
    images = []
    for file_path in files:
        try:
            img = Image.open(file_path)
            images.append(img.copy())
        except Exception as e:
            print(f"Failed to load {file_path}: {e}")
    
    if not images:
        return None
    
    # Determine the maximum width among all images
    max_width = max(img.width for img in images)
    
    # Resize images to have the same width while maintaining aspect ratio
    processed_images = []
    total_height = 0
    for img in images:
        if img.width != max_width:
            scaling_factor = max_width / img.width
            new_width = max_width
            new_height = int(img.height * scaling_factor)
            resized_img = img.resize((new_width, new_height), Image.LANCZOS)
            processed_images.append(resized_img)
            total_height += new_height
        else:
            processed_images.append(img)
            total_height += img.height
            
    # Create a new blank image with a white background
    stitched_image = Image.new('RGB', (max_width, total_height), (255, 255, 255))
    
    # Paste each processed image into the stitched image vertically
    y_offset = 0
    for img in processed_images:
        stitched_image.paste(img, (0, y_offset))
        y_offset += img.height
    
    # Save to file if output_path is provided
    if output_path:
        stitched_image.save(output_path)
        
    # Return as BytesIO object
    img_io = io.BytesIO()
    stitched_image.save(img_io, 'PNG')
    img_io.seek(0)
    return img_io

async def ainvoke_llm(image_data: str = None, text_data: str = None, model: str = "gpt-4o"):
    """
    Invokes the Azure OpenAI API to extract mark scheme from an image or text.
    
    Args:
        image_data: Base64 encoded image data (optional)
        text_data: Text content (optional)
        model: The model to use
        
    Returns:
        Response from the LLM
    """
    # Check if Azure OpenAI credentials are available
    if not all([AZURE_OPENAI_KEY, AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_VERSION, AZURE_OPENAI_DEPLOYMENT]):
        print("Azure OpenAI credentials not available, using dummy data")
        return None
    
    try:
        llm = AzureChatOpenAI(
            azure_endpoint=AZURE_OPENAI_ENDPOINT,
            api_key=AZURE_OPENAI_KEY,
            api_version=AZURE_OPENAI_VERSION,
            azure_deployment=AZURE_OPENAI_DEPLOYMENT,
            model=model,
            temperature=0,
        )

        format_instructions = JsonOutputParser(pydantic_object=AIExtractedMarkSchemeModel).get_format_instructions()
        prompt = structured_mark_scheme_extraction_prompt_template.format(format_instructions=format_instructions)

        # Create message content based on whether we have image or text
        if image_data:
            message_content = [
                {"type": "text", "text": prompt},
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{image_data}"},
                },
            ]
        else:
            # If text data, adjust the prompt accordingly
            message_content = [
                {"type": "text", "text": f"{prompt}\n\nHere is the mark scheme text to extract from:\n\n{text_data}"}
            ]

        prompt_template = ChatPromptTemplate.from_messages([
            SystemMessage(content=
            """
            You are a helpful, consistent and precise assistant that extracts the mark scheme from the provided content.
            """),
            HumanMessage(content=message_content),
        ])
        
        # Create chain with JSON output parsing
        chain = prompt_template | llm | JsonOutputParser(pydantic_object=AIExtractedMarkSchemeModel)
        
        response = await chain.ainvoke({})
        print("LLM Response:", json.dumps(response, indent=4))
        
        return response
    except Exception as e:
        print(f"Error invoking LLM: {e}")
        print(f"Exception type: {type(e)}")
        import traceback
        traceback.print_exc()
        return None

async def extract_mark_scheme(image_path=None, text_content=None, pdf_path=None):
    """
    Extracts a mark scheme from an image, text, or PDF using Azure OpenAI or Mistral OCR.
    
    Args:
        image_path: Path to the image file (optional)
        text_content: Text content of the mark scheme (optional)
        pdf_path: Path to the PDF file (optional)
        
    Returns:
        Extracted mark scheme data or list of mark schemes for PDFs
    """
    try:
        if pdf_path:
            print(f"Extracting mark schemes from PDF: {pdf_path}")
            mark_schemes = process_pdf_with_mistral(pdf_path)
            
            session['mark_schemes'] = mark_schemes
            session['current_mark_scheme_index'] = 0
            
            if mark_schemes and len(mark_schemes) > 0:
                return mark_schemes[0]
            else:
                print("No mark schemes extracted from PDF, using example")
                return get_example_mark_scheme()
        
        elif image_path:
            if image_path.lower().endswith('.pdf'):
                return await extract_mark_scheme(pdf_path=image_path)
            
            # Read the image file and encode it as base64
            with open(image_path, "rb") as image_file:
                image_data = base64.b64encode(image_file.read()).decode("utf-8")
            
            # Invoke the LLM with the image
            response = await ainvoke_llm(image_data=image_data)
        
        elif text_content:
            # Invoke the LLM with the text content
            response = await ainvoke_llm(text_data=text_content)
        
        # No input provided
        else:
            return get_example_mark_scheme()
        
        if response:
            session['mark_schemes'] = [response]
            session['current_mark_scheme_index'] = 0
            return response
        else:
            # Return a default example if LLM extraction failed
            return get_example_mark_scheme()
        
    except Exception as e:
        print(f"Error extracting mark scheme: {e}")
        import traceback
        traceback.print_exc()
        
        # Return an example mark scheme as fallback
        return get_example_mark_scheme()

def get_example_mark_scheme():
    """Returns an example mark scheme for demonstration purposes"""
    # Example AO2 mark scheme from the provided paste.txt
    return {
        "mark_scheme": [
            {
                "objective": "AO2",
                "mark_scheme": [
                    {
                        "level": "4",
                        "upper_mark_bound": 8,
                        "lower_mark_bound": 7,
                        "skills_descriptors": [
                            "Shows perceptive and detailed understanding of language:",
                            "Analyses the effects of the writer's choices of language",
                            "Selects a range of judicious textual detail",
                            "Makes sophisticated and accurate use of subject terminology"
                        ],
                        "indicative_standard": "The writer's description of the hyena criticises its unpleasant appearance and introduces the idea of it being a malicious threat. The adjective 'ugly' labels the hyena as grotesque straight away and this is further emphasised by the harshness of the dismissive short sentence. The writer has also chosen the phrase 'beyond redemption' because 'redemption' has connotations of being saved from evil, as if the hyena's ugliness is symbolic of a deeper sinister nature that cannot be reversed."
                    },
                    {
                        "level": "3",
                        "upper_mark_bound": 6,
                        "lower_mark_bound": 5,
                        "skills_descriptors": [
                            "Shows clear understanding of language:",
                            "Explains clearly the effects of the writer's choices of language",
                            "Selects a range of relevant textual detail",
                            "Makes clear and accurate use of subject terminology"
                        ],
                        "indicative_standard": "The writer makes the hyena's unpleasant appearance clear from the start when he says 'it was ugly beyond redemption'. This short sentence is deliberately blunt and the adjective 'ugly' introduces the animal as hideous. This ugliness along with the use of the word 'redemption' suggests there is nothing about this animal that could be saved as it has no redeeming features."
                    },
                    {
                        "level": "2",
                        "upper_mark_bound": 4,
                        "lower_mark_bound": 3,
                        "skills_descriptors": [
                            "Shows some understanding of language:",
                            "Attempts to comment on the effect of language",
                            "Selects some appropriate textual detail",
                            "Makes some use of subject terminology, mainly appropriately"
                        ],
                        "indicative_standard": "The writer uses adjectives to make the hyena's appearance seem unpleasant, 'ugly beyond redemption'. This phrase suggests that the hyena is so horrible to look at that there is nothing that could be done about it. There is no chance that anyone could ever see a hyena as attractive."
                    },
                    {
                        "level": "1",
                        "upper_mark_bound": 2,
                        "lower_mark_bound": 1,
                        "skills_descriptors": [
                            "Shows simple awareness of language:",
                            "Offers simple comment on the effect of language",
                            "Selects simple references or textual details",
                            "Makes simple use of subject terminology, not always appropriately"
                        ],
                        "indicative_standard": "The writer makes the hyena sound like a really ugly animal. It says 'it is ugly beyond redemption'. The writer has used an adjective to show the reader that this is not a nice animal to look at."
                    },
                    {
                        "level": "0",
                        "upper_mark_bound": 0,
                        "lower_mark_bound": 0,
                        "skills_descriptors": [
                            "Nothing to reward"
                        ],
                        "indicative_standard": None
                    }
                ],
                "guidance": "Note: If a student writes only about language outside of the given lines, the response should be placed in either Level 1 or Level 2, according to the quality of what is written.",
                "indicative_content": "AO2 content may include the effect of language features such as:\n- adjectives: 'ugly' 'shaggy' 'coarse' to emphasise the unpleasant appearance of the hyena\n- verbs: 'bungled' to suggest the hyena is not a perfect creation, causing either a sense of disgust or sympathy\n- contrast: 'none of the classy ostentation of a leopard's' to compare the hyena unfavourably to a familiar animal that the reader would be likely to consider beautiful\n- simile: 'like the symptoms of a skin disease' to exaggerate the unpleasant appearance of the hyena's spots, although again this may also arouse sympathy\n- adverbs: 'too massive' 'ridiculously mouse-like' 'too big' to intensify the hyena's disproportionate features\n- humour/hyperbole: 'suffering from a receding hairline' to mock the hyena's appearance, although 'suffering' could be read sympathetically\n- short (declarative) sentences: 'The nostrils are too big.' to add to the harsh, dismissive tone of the description\n- antithesis: 'doglike, but like no dog anyone would want as a pet' to present the contrast between the hyena and a more domestic animal.",
                "weight": 1.0
            }
        ],
        "subject": "English Language",
        "qualification_level": "A-Level",
        "exam_board": "aqa",
        "title": "AO2 (8 marks, 4 levels) - Language Analysis",
        "is_weighted": True
    }

def validate_mark_scheme(data):
    """
    Validates the mark scheme data against expected structure.
    
    Args:
        data: Mark scheme data to validate
        
    Returns:
        Tuple of (is_valid, errors)
    """
    errors = []
    
    # Check for required fields
    if not data.get('subject'):
        errors.append('Subject is required')
    elif data.get('subject') not in [subject.value for subject in SubjectEnum]:
        errors.append(f"Subject must be one of the valid subjects in the drop down")
    
    if not data.get('qualification_level'):
        errors.append('Qualification level is required')
    
    if not data.get('exam_board'):
        errors.append('Exam board is required')
    
    if not data.get('title'):
        errors.append('Title is required')
    
    # Check mark scheme array
    mark_scheme = data.get('mark_scheme', [])
    if not mark_scheme or not isinstance(mark_scheme, list) or len(mark_scheme) == 0:
        errors.append('At least one assessment objective is required')
    else:
        # Check total weights if any weights are present
        # Convert weights to float, treating empty strings and None as 0
        weights = []
        for obj in mark_scheme:
            weight = obj.get('weight')
            if weight is None or weight == '':
                weights.append(0)
            else:
                try:
                    weights.append(float(weight))
                except (ValueError, TypeError):
                    errors.append(f"Assessment objective {obj.get('objective', 'Unknown')}: Weight must be a number")
                    weights.append(0)
        
        # Only check weight total if any weights are non-zero
        if any(weights):
            total_weight = sum(weights)
            # Allow for floating point imprecision (e.g., 0.999999 or 1.000001)
            if not (0.99 <= total_weight <= 1.01):
                errors.append(f'Total weight must equal 1.0 (current total: {total_weight:.2f})')
        
        # Check each objective
        for i, obj in enumerate(mark_scheme):
            obj_prefix = f"Assessment objective {i+1}"
            
            if not obj.get('objective'):
                errors.append(f"{obj_prefix}: Objective name is required")
            
            # Check level definitions
            levels = obj.get('mark_scheme', [])
            if not levels or not isinstance(levels, list) or len(levels) == 0:
                errors.append(f"{obj_prefix}: At least one level definition is required")
            else:
                # Check each level
                for j, level in enumerate(levels):
                    level_prefix = f"{obj_prefix}, Level {level.get('level', j+1)}"
                    
                    if not level.get('level'):
                        errors.append(f"{level_prefix}: Level number is required")
                    
                    # Check mark bounds
                    upper_bound = level.get('upper_mark_bound')
                    lower_bound = level.get('lower_mark_bound')
                    
                    if upper_bound is None:
                        errors.append(f"{level_prefix}: Upper mark bound is required")
                    elif not isinstance(upper_bound, (int, float)):
                        errors.append(f"{level_prefix}: Upper mark bound must be a number")
                    
                    if lower_bound is None:
                        errors.append(f"{level_prefix}: Lower mark bound is required")
                    elif not isinstance(lower_bound, (int, float)):
                        errors.append(f"{level_prefix}: Lower mark bound must be a number")
                    
                    # Check that lower_bound <= upper_bound
                    if upper_bound is not None and lower_bound is not None and lower_bound > upper_bound:
                        errors.append(f"{level_prefix}: Lower mark bound ({lower_bound}) cannot be greater than upper mark bound ({upper_bound})")
                    
                    # Check skills descriptors
                    skills = level.get('skills_descriptors', [])
                    if not skills or not isinstance(skills, list) or len(skills) == 0:
                        errors.append(f"{level_prefix}: At least one skills descriptor is required")
                
                # Check for overlapping mark ranges
                if len(levels) > 1:
                    # Sort levels by lower mark bound
                    sorted_levels = sorted(levels, key=lambda x: x.get('lower_mark_bound', 0))
                    
                    # Check for overlaps
                    for j in range(len(sorted_levels) - 1):
                        current_level = sorted_levels[j]
                        next_level = sorted_levels[j + 1]
                        
                        current_upper = current_level.get('upper_mark_bound')
                        next_lower = next_level.get('lower_mark_bound')
                        
                        if current_upper is not None and next_lower is not None:
                            if current_upper >= next_lower:
                                errors.append(f"{obj_prefix}: Mark ranges for Level {current_level.get('level')} ({current_level.get('lower_mark_bound')}-{current_upper}) and Level {next_level.get('level')} ({next_lower}-{next_level.get('upper_mark_bound')}) overlap")
    
    return (len(errors) == 0, errors)

def process_assessment_objective_ids(mark_scheme_data):
    """
    Process the mark scheme data to add assessment objective IDs and ensure correct field order.
    
    Args:
        mark_scheme_data: Mark scheme data to process
        
    Returns:
        Processed mark scheme data with assessment objective IDs and proper field order
    """
    # Deep copy the input to avoid modifying it
    processed_data = json.loads(json.dumps(mark_scheme_data))
    
    # Load assessment objectives lookup
    ao_lookup = load_assessment_objectives()
    
    # Process assessment objective IDs for each objective in the mark scheme
    if processed_data and 'mark_scheme' in processed_data:
        processed_objectives = []
        
        for objective_item in processed_data['mark_scheme']:
            norm_subject = normalize_value(processed_data.get('subject'))
            norm_ms_qual = normalize_value(processed_data.get('qualification_level'))
            norm_objective = normalize_value(objective_item.get('objective'))
            
            if norm_subject and norm_ms_qual and norm_objective:
                # Determine the lookup key
                lookup_key = get_lookup_key(norm_subject, norm_ms_qual, norm_objective, ao_lookup)
                
                # Get the assessment objective ID
                assessment_objective_id = ao_lookup.get(lookup_key)

                print(f"Assessment objective ID: {assessment_objective_id}")
                
                if assessment_objective_id:
                    objective_item['assessment_objective_id'] = assessment_objective_id
                else:
                    print(f"Warning: No matching assessment objective found for key {lookup_key}.")
                    # Use a fallback ID or keep existing
                    if not objective_item.get('assessment_objective_id'):
                        objective_item['assessment_objective_id'] = "unknown"
            
            # Print guidance and indicative content values for debugging
            print(f"Objective: {objective_item.get('objective')}")
            print(f"  - guidance: {objective_item.get('guidance')}")
            print(f"  - indicative_content: {objective_item.get('indicative_content')}")
            
            # Create objective with correct field order
            ordered_objective = {
                'assessment_objective_id': objective_item.get('assessment_objective_id', 'unknown'),
                'objective': objective_item.get('objective', ''),
                'mark_scheme': [],
                'guidance': objective_item.get('guidance'),
                'indicative_content': objective_item.get('indicative_content'),
                'weight': objective_item.get('weight')
            }
            
            # Order the mark scheme levels properly
            if 'mark_scheme' in objective_item and isinstance(objective_item['mark_scheme'], list):
                ordered_levels = []
                for level in objective_item['mark_scheme']:
                    ordered_level = {
                        'level': level.get('level', ''),
                        'lower_mark_bound': level.get('lower_mark_bound'),
                        'upper_mark_bound': level.get('upper_mark_bound'),
                        'skills_descriptors': level.get('skills_descriptors', []),
                        'indicative_standard': level.get('indicative_standard')
                    }
                    ordered_levels.append(ordered_level)
                ordered_objective['mark_scheme'] = ordered_levels
            
            processed_objectives.append(ordered_objective)
        
        # Create final mark scheme with correct field order
        final_data = {
            'mark_scheme': processed_objectives,
            'subject': processed_data.get('subject', ''),
            'qualification_level': processed_data.get('qualification_level', ''),
            'exam_board': processed_data.get('exam_board', ''),
            'title': processed_data.get('title', ''),
            'is_weighted': processed_data.get('is_weighted')
        }
        
        # Print final data for debugging
        print("Final processed data structure:")
        print(json.dumps(final_data, indent=2))
        
        return final_data
    
    return processed_data

@app.route('/')
def index():
    # Initialize session if needed
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
        
    # Get the lists for dropdowns
    exam_boards = [{"value": board.value, "name": board.name} for board in ExamBoardEnum]
    qualification_levels = [{"value": level.value, "name": level.value} for level in QualificationLevelEnum]
    
    # Get all subjects from SubjectEnum, excluding NO_SUBJECT
    subjects = [{"value": subject.value, "name": subject.value} 
                for subject in SubjectEnum 
                if subject != SubjectEnum.NO_SUBJECT]
    
    return render_template('index.html', 
                           exam_boards=exam_boards,
                           qualification_levels=qualification_levels,
                           subjects=subjects)

@app.route('/upload', methods=['POST'])
def upload_files():
    print("Upload route called")
    print(f"Files in request: {request.files}")
    
    if 'files[]' not in request.files:
        print("No files part in request")
        return jsonify({'error': 'No files part'}), 400
    
    files = request.files.getlist('files[]')
    print(f"Number of files: {len(files)}")
    
    if not files or files[0].filename == '':
        print("No files selected")
        return jsonify({'error': 'No files selected'}), 400
    
    # Create user directory
    user_folder = os.path.join(app.config['UPLOAD_FOLDER'], session['user_id'])
    os.makedirs(user_folder, exist_ok=True)
    print(f"Created user folder: {user_folder}")
    
    # Save files
    file_info = []
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(user_folder, filename)
            file.save(filepath)
            print(f"Saved file: {filepath}")
            file_info.append({
                'name': filename,
                'path': filepath,
                'url': f"/static/uploads/{session['user_id']}/{filename}"
            })
    
    # Store file info in session
    session['files'] = file_info
    print(f"Stored {len(file_info)} files in session")
    
    if len(file_info) == 1:
        single_file_path = file_info[0]['path']
        
        if single_file_path.lower().endswith('.pdf'):
            session['pdf_path'] = single_file_path
            print(f"PDF file detected and stored in session: {single_file_path}")
            
            return jsonify({
                'files': file_info,
                'is_pdf': True,
                'pdf_url': file_info[0]['url']
            }), 200
        
        stitched_path = os.path.join(user_folder, 'stitched_image.png')
        
        # Copy the image to the stitched image path
        try:
            with Image.open(single_file_path) as img:
                img.save(stitched_path)
            
            # Store stitched image info in session
            session['stitched_image'] = stitched_path
            print(f"Single image automatically set as stitched image: {stitched_path}")
            
            # Return additional flag to indicate single image mode
            return jsonify({
                'files': file_info,
                'single_image': True,
                'is_pdf': False,
                'stitched_image_url': f"/static/uploads/{session['user_id']}/stitched_image.png?t={uuid.uuid4()}"
            }), 200
        except Exception as e:
            print(f"Error setting single image as stitched: {e}")
            # Continue with normal flow if there's an error
    
    return jsonify({'files': file_info}), 200

@app.route('/stitch', methods=['POST'])
def stitch_images_route():
    if 'files' not in session or not session['files']:
        return jsonify({'error': 'No files uploaded'}), 400
    
    # Get file order from request
    file_order = request.json.get('file_order', [])
    if not file_order:
        return jsonify({'error': 'No file order provided'}), 400
    
    # Get ordered file paths
    file_paths = []
    for file_name in file_order:
        for file_info in session['files']:
            if file_info['name'] == file_name:
                file_paths.append(file_info['path'])
                break
    
    # Stitch images
    user_folder = os.path.join(app.config['UPLOAD_FOLDER'], session['user_id'])
    output_path = os.path.join(user_folder, 'stitched_image.png')
    
    try:
        stitched_image = stitch_images(file_paths, output_path)
        if not stitched_image:
            return jsonify({'error': 'Failed to stitch images'}), 500
        
        # Store stitched image info in session
        session['stitched_image'] = output_path
        
        # Return the URL to the stitched image
        return jsonify({
            'success': True,
            'stitched_image_url': f"/static/uploads/{session['user_id']}/stitched_image.png?t={uuid.uuid4()}"
        }), 200
    except Exception as e:
        return jsonify({'error': f'Error stitching images: {str(e)}'}), 500

@app.route('/extract', methods=['POST'])
async def extract_mark_scheme_route():
    try:
        input_type = request.json.get('input_type')
        
        if input_type == 'image':
            # Extract from image
            if 'stitched_image' not in session:
                return jsonify({'error': 'No stitched image available'}), 400
            
            mark_scheme = await extract_mark_scheme(image_path=session['stitched_image'])
        elif input_type == 'text':
            # Extract from text
            text_content = request.json.get('text_content')
            if not text_content:
                return jsonify({'error': 'No text content provided'}), 400
            
            mark_scheme = await extract_mark_scheme(text_content=text_content)
        elif input_type == 'pdf':
            if 'pdf_path' not in session:
                return jsonify({'error': 'No PDF file available'}), 400
            
            mark_scheme = await extract_mark_scheme(pdf_path=session['pdf_path'])
        else:
            return jsonify({'error': 'Invalid input type'}), 400
        
        # Store in session
        session['mark_scheme'] = mark_scheme
        
        total_mark_schemes = len(session.get('mark_schemes', []))
        
        return jsonify({
            'success': True,
            'mark_scheme': mark_scheme,
            'total_mark_schemes': total_mark_schemes,
            'current_index': session.get('current_mark_scheme_index', 0)
        }), 200
    except Exception as e:
        return jsonify({'error': f'Error extracting mark scheme: {str(e)}'}), 500

@app.route('/validate', methods=['POST'])
def validate_mark_scheme_route():
    try:
        # Get the mark scheme to validate
        mark_scheme = request.json
        
        if not mark_scheme:
            return jsonify({
                'valid': False,
                'errors': ['No mark scheme provided']
            }), 400
        
        # Validate the mark scheme
        is_valid, errors = validate_mark_scheme(mark_scheme)
        
        return jsonify({
            'valid': is_valid,
            'errors': errors
        }), 200
    except Exception as e:
        return jsonify({
            'valid': False,
            'errors': [f'Error validating mark scheme: {str(e)}']
        }), 500

@app.route('/get_processed_json', methods=['POST'])
def get_processed_json():
    try:
        # Get the mark scheme data from the request
        mark_scheme_data = request.json
        
        # Validate the mark scheme first
        is_valid, errors = validate_mark_scheme(mark_scheme_data)
        
        if not is_valid:
            return jsonify({
                'success': False,
                'errors': errors
            }), 400
        
        # Process the mark scheme to add assessment objective IDs
        processed_data = process_assessment_objective_ids(mark_scheme_data)
        
        return jsonify({
            'success': True,
            'processed_data': processed_data
        }), 200
    except Exception as e:
        print(f"Error getting processed JSON: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Error getting processed JSON: {str(e)}'}), 500

@app.route('/navigate_mark_scheme', methods=['POST'])
def navigate_mark_scheme():
    try:
        direction = request.json.get('direction')
        
        if 'mark_schemes' not in session or not session['mark_schemes']:
            return jsonify({'error': 'No mark schemes available'}), 400
        
        current_index = session.get('current_mark_scheme_index', 0)
        total_mark_schemes = len(session['mark_schemes'])
        
        if direction == 'next':
            new_index = min(current_index + 1, total_mark_schemes - 1)
        elif direction == 'prev':
            new_index = max(current_index - 1, 0)
        else:
            return jsonify({'error': 'Invalid direction'}), 400
        
        session['current_mark_scheme_index'] = new_index
        
        mark_scheme = session['mark_schemes'][new_index]
        
        session['mark_scheme'] = mark_scheme
        
        return jsonify({
            'success': True,
            'mark_scheme': mark_scheme,
            'total_mark_schemes': total_mark_schemes,
            'current_index': new_index
        }), 200
    except Exception as e:
        print(f"Error navigating mark schemes: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Error navigating mark schemes: {str(e)}'}), 500

@app.route('/extract_mark_scheme', methods=['POST'])
def extract_mark_scheme_from_pdf():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'File must be a PDF'}), 400
        
        # Create user directory
        if 'user_id' not in session:
            session['user_id'] = str(uuid.uuid4())
        
        user_folder = os.path.join(app.config['UPLOAD_FOLDER'], session['user_id'])
        os.makedirs(user_folder, exist_ok=True)
        
        filename = secure_filename(file.filename)
        filepath = os.path.join(user_folder, filename)
        file.save(filepath)
        
        session['pdf_path'] = filepath
        
        mark_schemes = process_pdf_with_mistral(filepath)
        
        if not mark_schemes:
            return jsonify({'error': 'No mark schemes found in the PDF'}), 400
        
        session['mark_schemes'] = mark_schemes
        session['current_mark_scheme_index'] = 0
        
        session['mark_scheme'] = mark_schemes[0]
        
        return jsonify({
            'success': True,
            'mark_schemes': mark_schemes,
            'total_mark_schemes': len(mark_schemes),
            'current_index': 0
        }), 200
    except Exception as e:
        print(f"Error processing PDF: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Error processing PDF: {str(e)}'}), 500

@app.route('/submit', methods=['POST'])
def submit_mark_scheme():
    try:
        # Get the updated mark scheme from the request
        updated_mark_scheme = request.json
        
        # Validate the mark scheme
        is_valid, errors = validate_mark_scheme(updated_mark_scheme)
        
        if not is_valid:
            return jsonify({
                'success': False,
                'errors': errors
            }), 400
        
        # Process the mark scheme to add assessment objective IDs
        processed_data = process_assessment_objective_ids(updated_mark_scheme)

        print(f"Updated mark scheme: {json.dumps(processed_data, indent=4)}")
        
        # In a real application, you would save this to a database
        # For now, just return success
        
        return jsonify({
            'success': True,
            'message': 'Mark scheme submitted successfully! 🎉',
        }), 200
    except Exception as e:
        print(f"Error submitting mark scheme: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Error submitting mark scheme: {str(e)}'}), 500


# Modified run function to support async routes
if __name__ == '__main__':
    # When running Flask with async views, we need to use an ASGI server
    # For development, we can use the built-in Flask development server
    # but we need to make sure we're running with asyncio
    import asyncio
    from werkzeug.serving import run_simple
    
    # Run the Flask app
    print("Starting British Countryside Mark Scheme Maker...")
    print("Visit http://127.0.0.1:5000/ in your browser")
    app.run(debug=True, use_reloader=True)
