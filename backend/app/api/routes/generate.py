from fastapi import APIRouter, HTTPException

from app.ai.mock import MockAIService
from app.database.session_manager import session_manager
from app.models.generate import (
    GenerateRequest,
    GenerateResponse,
)

router = APIRouter(prefix="/generate", tags=["AI"])

ai_service = MockAIService()


@router.post("", response_model=GenerateResponse)
def generate_sql(request: GenerateRequest):

    try:
        db = session_manager.get_session(
            request.session_id
        )

    except KeyError as exc:
        raise HTTPException(
            status_code=404,
            detail="Database session not found",
        ) from exc

    schema = db.get_schema()

    result = ai_service.generate_sql(
        request.question,
        schema.model_dump(),
    )

    return GenerateResponse(**result)