structured_mark_scheme_extraction_prompt_template = """
Here are some examples of extracted mark schemes:

**Example 1:**

{{
    "mark_scheme": [
        {{
            "objective": "AO3",
            "mark_scheme": [
                {{
                    "level": "4",
                    "upper_mark_bound": 8,
                    "lower_mark_bound": 7,
                    "skills_descriptors": [
                        "Complex explanation of changes."
                    ],
                    "indicative_standard": null
                }},
                {{
                    "level": "3",
                    "upper_mark_bound": 6,
                    "lower_mark_bound": 5,
                    "skills_descriptors": [
                        "Developed explanation of changes."
                    ],
                    "indicative_standard": null
                }},
                {{
                    "level": "2",
                    "upper_mark_bound": 4,
                    "lower_mark_bound": 3,
                    "skills_descriptors": [
                        "Simple explanation of change."
                    ],
                    "indicative_standard": null
                }},
                {{
                    "level": "1",
                    "upper_mark_bound": 2,
                    "lower_mark_bound": 1,
                    "skills_descriptors": [
                        "Basic explanation of change(s)."
                    ],
                    "indicative_standard": null
                }},
                {{
                    "level": "0",
                    "upper_mark_bound": 0,
                    "lower_mark_bound": 0,
                    "skills_descriptors": [
                        "No relevant content."
                    ],
                    "indicative_standard": null
                }}
            ],
            "weight": null
        }}
    ],
    "guidance": null,
    "indicative_content": null,
    "title": "AO3 (8 marks, 4 levels) - Analysis of changes"
}}


**Example 2:**

{{
    "mark_scheme": [
        {{
            "objective": "AO4",
            "mark_scheme": [
                {{
                    "level": "3",
                    "upper_mark_bound": 6,
                    "lower_mark_bound": 5,
                    "skills_descriptors": [
                        "The method would lead to the production of a valid outcome.",
                        "The key steps are identified and logically sequenced."
                    ],
                    "indicative_standard": null
                }},
                {{
                    "level": "2",
                    "upper_mark_bound": 4,
                    "lower_mark_bound": 3,
                    "skills_descriptors": [
                        "The method would not necessarily lead to a valid outcome.",
                        "Most steps are identified, but the method is not fully logically sequenced."
                    ],
                    "indicative_standard": null
                }},
                {{
                    "level": "1",
                    "upper_mark_bound": 2,
                    "lower_mark_bound": 1,
                    "skills_descriptors": [
                        "The method would not lead to a valid outcome.",
                        "Some relevant steps are identified, but links are not made clear."
                    ],
                    "indicative_standard": null
                }},
                {{
                    "level": "0",
                    "upper_mark_bound": 0,
                    "lower_mark_bound": 0,
                    "skills_descriptors": [
                        "No relevant content."
                    ],
                    "indicative_standard": null
                }}
            ],
            "weight": null
        }}
    ],
    "guidance": "Markers should ensure that students' responses demonstrate logical sequencing of steps. Partial credit should be awarded if some steps are included but not fully developed.",
    "indicative_content": "A valid response may include key steps such as defining the problem, identifying variables, outlining a step-by-step procedure, and justifying choices made in the methodology.",
    "title": "AO4 (6 marks, 3 levels) - Methodology"
}}



**Example 3:**

{{
    "mark_scheme": [
        {{
            "objective": "AO1",
            "mark_scheme": [
                {{
                    "level": "4",
                    "upper_mark_bound": 20,
                    "lower_mark_bound": 16,
                    "skills_descriptors": [
                        "Uses precise linguistic methods to analyse language with clarity and depth.",
                        "Effectively applies multiple levels of linguistic analysis in an integrated way.",
                        "Demonstrates logical structuring of ideas and clear, academic writing.",
                        "Rare errors in analysis and terminology use."
                    ],
                    "indicative_standard": "In this text, the writer employs a range of syntactic structures to create a persuasive tone, particularly through the use of parallelism and anaphora. The phrase 'we will rise, we will fight, we will stand' reinforces unity through repetition, demonstrating the deliberate construction of persuasive rhetoric. Additionally, the use of modal verbs such as 'must' and 'shall' adds an authoritative stance, emphasizing obligation. The writer’s lexical choices, particularly in selecting abstract nouns like 'freedom' and 'justice,' contribute to the emotive appeal, engaging the reader’s sense of morality."
                }},
                {{
                    "level": "3",
                    "upper_mark_bound": 15,
                    "lower_mark_bound": 11,
                    "skills_descriptors": [
                        "Uses linguistic methods effectively but with occasional inconsistencies.",
                        "Applies more than one level of analysis, though not fully integrated.",
                        "Communicates ideas clearly with logical progression.",
                        "Some minor errors in language use or analysis."
                    ],
                    "indicative_standard": "The writer’s use of rhetorical questions like 'Can we truly ignore this?' engages the reader by prompting reflection. The text employs figurative language, such as metaphors, to evoke emotion, as seen in 'a storm of change is coming.' While the analysis correctly identifies stylistic choices, there is limited exploration of their full impact on the reader, making the argument somewhat underdeveloped."
                }},
                {{
                    "level": "2",
                    "upper_mark_bound": 10,
                    "lower_mark_bound": 6,
                    "skills_descriptors": [
                        "Attempts to use linguistic methods but with gaps in understanding.",
                        "Limited engagement with language patterns and structures.",
                        "Some ideas are structured but lack depth in analysis.",
                        "Frequent errors in language or application of methods."
                    ],
                    "indicative_standard": "The writer repeats the phrase 'we need change' multiple times to show importance. There is also a use of long and short sentences, making the text more dramatic. However, the explanation does not fully explore how these techniques affect the reader, and there is some misidentification of sentence types."
                }},
                {{
                    "level": "1",
                    "upper_mark_bound": 5,
                    "lower_mark_bound": 1,
                    "skills_descriptors": [
                        "Minimal attempt to apply linguistic methods.",
                        "Little to no relevant analysis beyond identification.",
                        "Response lacks logical structure and coherence.",
                        "Frequent errors in grammar, spelling, and terminology."
                    ],
                    "indicative_standard": "The writer uses big words to make their point sound strong. They also ask a question, which might make the reader think. The sentences are sometimes long. There is not much explanation, and it is not clear why these things matter."
                }},
                {{
                    "level": "0",
                    "upper_mark_bound": 0,
                    "lower_mark_bound": 0,
                    "skills_descriptors": [
                        "No relevant content or analysis."
                    ],
                    "indicative_standard": null
                }}
            ],
            "weight": 0.8
        }},
        {{
            "objective": "AO2",
            "mark_scheme": [
                {{
                    "level": "4",
                    "upper_mark_bound": 20,
                    "lower_mark_bound": 16,
                    "skills_descriptors": [
                        "Critically evaluates linguistic concepts and theories with sophistication.",
                        "Integrates multiple viewpoints and provides well-supported arguments.",
                        "Demonstrates a deep understanding of theoretical frameworks.",
                        "Minimal errors in reasoning or terminology use."
                    ],
                    "indicative_standard": "Labov’s narrative structure can be applied to this text, where the orientation stage sets the scene, the complication introduces a problem, and the resolution provides closure. The writer manipulates clause structures to mimic spoken discourse, evident in the non-standard coordination of clauses. Furthermore, Fairclough’s theory of synthetic personalisation is evident in the direct address to the audience, reinforcing solidarity. This suggests that the text aligns with discourse-based approaches to interaction."
                }},
                {{
                    "level": "3",
                    "upper_mark_bound": 15,
                    "lower_mark_bound": 11,
                    "skills_descriptors": [
                        "Demonstrates understanding of linguistic theories with clear analysis.",
                        "Considers alternative perspectives with some critical evaluation.",
                        "Presents structured arguments with some inconsistencies.",
                        "Some errors in reasoning but generally well-explained."
                    ],
                    "indicative_standard": "The text uses direct address, which Fairclough’s theory of synthetic personalisation explains as making the reader feel included. There is also evidence of Lakoff’s politeness theory in the use of hedging like ‘perhaps’ to soften statements. While these elements are correctly identified, there is limited exploration of their broader implications."
                }},
                {{
                    "level": "2",
                    "upper_mark_bound": 10,
                    "lower_mark_bound": 6,
                    "skills_descriptors": [
                        "Demonstrates basic understanding of linguistic concepts.",
                        "Limited engagement with alternative viewpoints.",
                        "Arguments are underdeveloped and lack strong supporting evidence.",
                        "Frequent inconsistencies in reasoning."
                    ],
                    "indicative_standard": "The writer is using words that make the reader feel included. The text is structured like a story. There are some mentions of theories, but they are not explained in depth."
                }},
                {{
                    "level": "1",
                    "upper_mark_bound": 5,
                    "lower_mark_bound": 1,
                    "skills_descriptors": [
                        "Minimal engagement with linguistic theories or perspectives.",
                        "Ideas are largely descriptive rather than analytical.",
                        "Responses lack coherence and structure.",
                        "Frequent misunderstandings of theoretical concepts."
                    ],
                    "indicative_standard": "The writer uses words that seem persuasive. There is an argument being made, but it is not clear what theories support it. There are some mentions of audience, but they are vague."
                }},
                {{
                    "level": "0",
                    "upper_mark_bound": 0,
                    "lower_mark_bound": 0,
                    "skills_descriptors": [
                        "No relevant discussion or analysis."
                    ],
                    "indicative_standard": null
                }}
            ],
            "weight": 0.2
        }}
    ],
    "guidance": null,
    "indicative_content": null,
    "title": "AO1 (80%), AO2 (20%) (20 marks, 4 levels) - Modern Prose or Drama"
}}


**Example 4:**

{{
    "mark_scheme": [
        {{
            "objective": "AO1",
            "mark_scheme": [
                {{
                    "level": "4",
                    "upper_mark_bound": 20,
                    "lower_mark_bound": 16,
                    "skills_descriptors": [
                        "Demonstrates precise and sophisticated application of linguistic methods.",
                        "Effectively integrates multiple levels of language analysis.",
                        "Communicates ideas with clarity and logical progression.",
                        "Minimal errors in analysis."
                    ],
                    "indicative_standard": null
                }},
                {{
                    "level": "3",
                    "upper_mark_bound": 15,
                    "lower_mark_bound": 11,
                    "skills_descriptors": [
                        "Uses linguistic methods accurately with well-developed analysis.",
                        "Demonstrates awareness of different levels of language use.",
                        "Expresses ideas clearly but may have minor inconsistencies.",
                        "Some errors in application but overall structured."
                    ],
                    "indicative_standard": null
                }},
                {{
                    "level": "2",
                    "upper_mark_bound": 10,
                    "lower_mark_bound": 6,
                    "skills_descriptors": [
                        "Attempts to use linguistic methods but with noticeable gaps.",
                        "Limited analysis of language features and patterns.",
                        "Some ideas are structured, but response lacks depth.",
                        "Errors are more frequent and impact clarity."
                    ],
                    "indicative_standard": null
                }},
                {{
                    "level": "1",
                    "upper_mark_bound": 5,
                    "lower_mark_bound": 1,
                    "skills_descriptors": [
                        "Minimal attempt to apply linguistic methods.",
                        "Little to no relevant analysis.",
                        "Responses are disorganised and lack logical progression.",
                        "Frequent errors and misunderstanding of linguistic concepts."
                    ],
                    "indicative_standard": null
                }},
                {{
                    "level": "0",
                    "upper_mark_bound": 0,
                    "lower_mark_bound": 0,
                    "skills_descriptors": [
                        "No relevant content or analysis."
                    ],
                    "indicative_standard": null
                }}
            ],
            "weight": null
        }},
        {{
            "objective": "AO4",
            "mark_scheme": [
                {{
                    "level": "4",
                    "upper_mark_bound": 20,
                    "lower_mark_bound": 16,
                    "skills_descriptors": [
                        "Evaluates linguistic theories and perspectives with sophistication.",
                        "Integrates multiple viewpoints with critical analysis.",
                        "Constructs a coherent and well-supported argument.",
                        "Minimal errors in reasoning."
                    ],
                    "indicative_standard": null
                }},
                {{
                    "level": "3",
                    "upper_mark_bound": 15,
                    "lower_mark_bound": 11,
                    "skills_descriptors": [
                        "Demonstrates understanding of linguistic theories with clear analysis.",
                        "Considers alternative perspectives with some critical depth.",
                        "Presents a structured argument with some inconsistencies.",
                        "Some errors in reasoning but generally clear."
                    ],
                    "indicative_standard": null
                }},
                {{
                    "level": "2",
                    "upper_mark_bound": 10,
                    "lower_mark_bound": 6,
                    "skills_descriptors": [
                        "Demonstrates basic understanding of linguistic concepts.",
                        "Limited engagement with different perspectives.",
                        "Arguments are underdeveloped and lack strong support.",
                        "Frequent inconsistencies in reasoning."
                    ],
                    "indicative_standard": null
                }},
                {{
                    "level": "1",
                    "upper_mark_bound": 5,
                    "lower_mark_bound": 1,
                    "skills_descriptors": [
                        "Minimal engagement with linguistic theories.",
                        "Ideas are largely descriptive with little analysis.",
                        "Responses lack structure and coherence.",
                        "Frequent errors and weak argumentation."
                    ],
                    "indicative_standard": null
                }},
                {{
                    "level": "0",
                    "upper_mark_bound": 0,
                    "lower_mark_bound": 0,
                    "skills_descriptors": [
                        "No relevant discussion or analysis."
                    ],
                    "indicative_standard": null
                }}
            ],
            "weight": null
        }}
    ],
    "guidance": null,
    "indicative_content": null,
    "title": "AO1 (20 marks, 4 levels), AO4 (20 marks, 4 levels) - Modern Prose or Drama"
}}

{format_instructions}


Guidance:
- Sometimes there may be multiple assessment objectives being examined in one markscheme. In this case, you should separate the mark schemes for each objective into its own mark scheme and assign it the correct objective.
- Sometimes there may not be any guidance, indicative content or indicative standards. In this case, you should return None for the guidance, indicative content and indicative standards.
- Ensure to follow the format specified.
- The title can hold different forms. The form depends on the number of assessment objectives in the mark scheme and whether there are weights.
- If there are multiple assessment objectives, the title will have the format of AOx (y marks, z levels), AOu (v marks, w levels) - short title of the mark scheme. e.g. 'AO1 (10 marks, 5 levels), AO3 (15 marks, 5 levels) - Language Analysis and Context and Meaning'.
- If there is only one assessment objective, the title will have the format of AOx (x marks, x levels) - short title of the mark scheme. e.g. 'AO1 (10 marks, 5 levels) - Language Analysis and Context and Meaning'.
- If there are weights, the title will have the format of AOx (y%), AOu (v%) - short title of the mark scheme. e.g. 'AO1 (80%), AO2 (20%) - Modern Prose or Drama'.
- For the title, you should come up with a short title which describes what the mark scheme is assessing as seen in the examples.
- The number of levels should be the same as the number of the top level in the mark scheme.
- Ensure to extract all the mark schemes from the image.
- Ensure the extracted mark schemes are taken word for word from the image.
- In some cases, there are included in the images, weights for the assessment objectives. If there are weights, you should set the marks of each assessment objective max marks to the same and just set the weight.

Your task:
Extract the mark scheme from the image into the format specified.
"""