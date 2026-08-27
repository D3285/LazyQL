from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
    session_id: str
    question: str = Field(min_length=1)


class GenerateResponse(BaseModel):
    sql: str
    explanation: str
    confidence: float