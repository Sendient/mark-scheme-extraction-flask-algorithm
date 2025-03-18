from enum import Enum

class SubjectEnum(str, Enum):
    """
    This enum is used globally to refer to subjects within the platform.

    It is loosely based on the AQA and Pearson GCSE and A-Level specifications.
    """

    NO_SUBJECT = ""
    """This is a placeholder for when a subject is not known."""

    ACCOUNTING = "Accounting"
    ARABIC = "Arabic"
    ART_AND_DESIGN = "Art and Design"

    BENGALI = "Bengali"
    BIBLICAL_HEBREW = "Biblical Hebrew"
    BIOLOGY = "Biology"
    BUSINESS = "Business"

    CHEMISTRY = "Chemistry"
    CHINESE = "Chinese"
    CITIZENSHIP_STUDIES = "Citizenship Studies"
    COMPUTER_SCIENCE = "Computer Science"
    COMBINED_SCIENCE = "Combined Science"

    DANCE = "Dance"
    DESIGN_AND_TECHNOLOGY = "Design and Technology"
    DRAMA = "Drama"
    DRAMA_THEATRE_STUDIES = "Drama Theatre Studies"

    ECONOMICS = "Economics"
    ENGINEERING = "Engineering"
    ENGLISH = "English"
    ENGLISH_LANGUAGE = "English Language"
    ENGLISH_LITERATURE = "English Literature"
    ENVIRONMENTAL_SCIENCE = "Environmental Science"

    FOOD_PREPARATION_AND_NUTRITION = "Food preparation and Nutrition"
    FRENCH = "French"

    GEOGRAPHY = "Geography"
    GENERAL_KNOWLEDGE = "General Knowledge"
    GERMAN = "German"

    HEBREW_BIBLICAL = "Hebrew (Biblical)"
    HEBREW_MODERN = "Hebrew (Modern)"
    HISTORY = "History"

    ITALIAN = "Italian"

    LAW = "Law"

    MATHEMATICS = "Mathematics"
    MEDIA_STUDIES = "Media Studies"
    MUSIC = "Music"

    PANJABI = "Panjabi"
    PHILOSOPHY = "Philosophy"
    PHYSICAL_EDUCATION = "Physical Education"
    PHYSICS = "Physics"
    POLISH = "Polish"
    POLITICS = "Politics"
    PROJECTS = "Projects"
    PSYCHOLOGY = "Psychology"

    RELIGIOUS_STUDIES = "Religious Studies"
    RUSSIAN = "Russian"

    SCIENCE = "Science"
    SOCIOLOGY = "Sociology"
    SPANISH = "Spanish"
    STATISTICS = "Statistics"

    TURKISH = "Turkish"

    GREEK = "Greek"

    INFORMATION_AND_COMMUNICATION_TECHNOLOGY = (
        "Information and Communication Technology"
    )

    MODERN_LANGUAGES = "Modern Languages"

    URDU = "Urdu"