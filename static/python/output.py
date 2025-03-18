from pydantic import BaseModel, Field
from enum import Enum

class LeveledMarkSchemeModel(BaseModel):
    """Represents a leveled mark scheme."""

    level: str = Field(description="A string describing the level in the mark scheme. This is usually a number but should be what it states in the mark scheme image.")
    """The level of the mark scheme."""
    upper_mark_bound: int = Field(description="The upper mark bound for the mark scheme level.")
    """The upper mark bound for the mark scheme."""
    lower_mark_bound: int = Field(description="The lower mark bound for the mark scheme level.")
    """The lower mark bound for the mark scheme."""
    skills_descriptors: list[str] = Field(description="A list containing the skills descriptors for a mark scheme level.")
    """List of skill descriptors"""
    indicative_standard: str | None = Field(description="Examples of quality of answer for a given level")
    """Examples of quality of answer"""

class ObjectiveMarkSchemeModel(BaseModel):
    """Represents a mark scheme for an objective."""

    objective: str = Field(description="The objective for the mark scheme. ie. AO1")
    """The objective for the mark scheme. ie. AO1"""
    mark_scheme: list[LeveledMarkSchemeModel] = Field(description="The mark scheme for the objective.")
    """The mark scheme for the objective."""
    weight: float | None = Field(description="The decimal weight of the assessment objective as a ratio of the total marks available for the question.")
    """The weight of the assessment objective"""
    

class AIExtractedMarkSchemeModel(BaseModel):
    """Represents a mark scheme."""

    mark_scheme: list[ObjectiveMarkSchemeModel]
    """The mark scheme for the question."""
    guidance: str | None = Field(description="Extra information given in the image regarding the mark scheme and how to mark the answer.")
    """Marking guidance"""
    indicative_content: str | None = Field(description="Potential content which could appear in the answer")
    """Potential content in the answer """
    title: str | None = Field(description="The title of the mark scheme.")
    """The title of the mark scheme"""



class ExamBoardEnum(str, Enum):
    """The type of exam board."""

    EDEXCEL = "edexcel"
    AQA = "aqa"
    OCR = "ocr"
    WJEC = "wjec"
    CCEA = "ccea"
    SQA = "sqa"

class QualificationLevelEnum(str, Enum):
    """The qualification level of the assessment."""

    SAT_KS2 = "SAT_KS2"
    GCSE = "GCSE"
    IGCSE = "IGCSE"
    A_LEVEL = "A-Level"
    BTEC = "BTEC"


class DataBaseObjectiveMarkSchemeModel(BaseModel):
    """Represents a mark scheme for an objective."""

    assessment_objective_id: str
    """The ID of the assessment objective."""
    objective: str
    """The objective for the mark scheme. ie. AO1"""
    mark_scheme: list[LeveledMarkSchemeModel]
    """The mark scheme for the objective."""
    guidance: str | None = None
    """Marking guidance"""
    indicative_content: str | None = None
    """Potential content in the answer """
    weight: float | None = None
    """The weight of the assessment objective"""

class DataBaseQuestionLevelledMarkscheme(BaseModel):
    """This class is to populate mark scheme library with templates for different subjects and qualification levels"""

    mark_scheme: list[DataBaseObjectiveMarkSchemeModel]
    """The mark scheme for the question."""
    subject: str
    """The subject of the question."""
    qualification_level: QualificationLevelEnum
    """The qualification level of the question."""
    exam_board: ExamBoardEnum
    """The exam board for the question."""
    title: str
    """The title of the markscheme containing data re AOs, marks and levels, i.e. AO4-16m-4l-language"""
    is_weighted: bool | None = None
    """Flag for mark scheme with weights per AO"""