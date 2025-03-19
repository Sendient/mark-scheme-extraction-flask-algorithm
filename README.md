# British Countryside Mark Scheme Maker

Welcome to the **British Countryside Mark Scheme Maker**, a Flask-based web application designed to extract, validate, and process mark schemes from images or text inputs. Featuring our beautiful British countryside, this tool uses Azure OpenAI GPT-4o for mark scheme extraction and provides an interactive interface to upload images, stitch them together, and refine the resulting mark schemes.

Enjoy the countryside while you wait for the mark scheme to be extracted :)

## Features

- **Image and Text Input**: Upload images (PNG, JPG, JPEG) or paste text to extract mark schemes.
- **Image Stitching**: Combine multiple uploaded images into a single stitched image for processing.
- **Mark Scheme Extraction**: Uses Azure OpenAI to extract structured mark schemes from images or text.
- **Validation**: Ensures mark schemes meet predefined criteria with detailed error reporting.
- **Assessment Objective Mapping**: Links extracted objectives to a predefined set in `ao.json`.
- **Interactive UI**: British countryside-themed interface with seasonal animations and sheep who run away (and cows who turn their heads!).
- **Responsive Design**: Optimised for desktop and mobile use.

## Directory Structure

```

|   .env                # Environment variables (e.g., Azure OpenAI credentials)
|   .gitignore          # Git ignore file
|   ao.json             # Assessment objectives data
|   app.py              # Main Flask application
|   README.md           # Project documentation (this file)
|   requirements.txt    # Python dependencies
|   
+---static
|   +---css
|   |       styles.css  # CSS for the British countryside theme
|   +---js
|   |       main.js     # JavaScript for frontend interactivity
|   +---python
|   |   |   output.py   # Pydantic models and enums for mark scheme structure
|   |   |   prompt_lib.py  # Prompt templates for LLM
|   |   |   subjects.py # Subject enum definitions
|   |   |   __init__.py # Python package initialisation
|   |   \---__pycache__ # Compiled Python files
|   \---uploads         # Directory for uploaded and stitched images
\---templates
        index.html      # HTML template for the frontend
```

## Prerequisites

- Python 3.8+
- Git
- An Azure OpenAI account with API credentials

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ChrisLockSendient/mark-scheme-extraction-flask.git
   cd british-countryside-mark-scheme-maker
   ```

2. **Create a Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   - Create a `.env` file in the root directory.
   - Add the Azure OpenAI credentials which can be found on 1password under the name of Azure GPT-4o (DEV):
     ```
     AZURE_OPENAI_KEY=your-api-key
     AZURE_OPENAI_ENDPOINT=your-endpoint
     AZURE_OPENAI_VERSION=your-api-version
     AZURE_OPENAI_DEPLOYMENT=your-deployment-name
     ```

5. **Run the Application**:
   ```bash
   python app.py
   ```
   - The app will start at `http://127.0.0.1:5000/`.
   - Visit this URL in your browser to access the interface.

## Usage

1. **Access the Interface**:
   - Open your browser and navigate to `http://127.0.0.1:5000/`.

2. **Choose Input Method**:
   - Select either "Image" or "Text" input using the toggle buttons.

3. **Image Input**:
   - `Drag and drop` images into the upload area or `click to select` files or `paste` in the images.
   - Preview the images uploaded by clicking on their thumbnail.
   - Remove images by clicking the X in the top right of that image.
   - Click "Upload Images" to upload them.
   - Reorder uploaded images if needed by grabbing the handle and dragging the image up or down.
   - Stitch the image vertically by clicking "Stitch Image".
   - Make sure the stitched image looks right as this is being sent to the AIextractortron.
   - Click the "Extract Mark Scheme" button to extract the mark scheme.

4. **Text Input**:
   - Paste mark scheme text into the text area.
   - Click "Process Text" to process the text and extract the mark scheme.

5. **Review and Edit**:
   - View the extracted mark scheme with levels, skills descriptors, guidance and indicative content.
   - Ensure to add the subject, qualification level and exam board
   - Review the title to ensure it looks correct
   - Edit anything in the mark scheme content which looks wrong.
   - Edit fields inline (e.g., objective names, weights, mark bounds).
   - Validate the mark scheme using the "Validate" button.

6. **Submit**:
   - Once validated, click "View JSON" to process the mark scheme with assessment objective IDs.
   - The processed JSON will be displayed and can be copied by pressing the copy button (database integration pending).

## Technical Details

- **Backend**: Flask with async support for LLM calls, using `asyncio` and `werkzeug`.
- **Frontend**: HTML (`index.html`), CSS (`styles.css`) with a British countryside theme, and JavaScript (`main.js`) for interactivity.
- **LLM Integration**: Azure OpenAI via `langchain_openai` for mark scheme extraction.
- **Image Processing**: PIL (Pillow) for stitching images vertically.
- **Validation**: Custom validation logic ensures mark scheme integrity.
- **Data Models**: Pydantic models in `output.py` define the mark scheme structure.


## Troubleshooting

- **LLM Errors**: Ensure Azure OpenAI credentials are correct in `.env`.
- **Image Upload Issues**: Check file size (<16MB) and format (PNG, JPG, JPEG, GIF).
- **Validation Failures**: Review error messages in the UI for specific issues.

## Future Enhancements

- **Database Integration**: Add ability for uploading mark scheme to the database.


## Acknowledgments

- Built with ❤️ by me.
- Inspired by the charm of the British countryside.