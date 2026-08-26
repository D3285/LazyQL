from fastapi import APIRouter, HTTPException

from app.database.connection import create_database_adapter
from app.database.exceptions import DatabaseConnectionError
from app.models.database import DatabaseConfig
from app.models.schema import DatabaseSchema
from app.database.session_manager import session_manager
from app.models.session import (
    DatabaseSession,
    DatabaseSessionRequest,
    QueryRequest,
    QueryResponse,
)


router = APIRouter(
    prefix="/database",
    tags=["database"],
)


@router.post(
    "/schema",
    response_model=DatabaseSchema,
)
def get_schema(session_id: str):
    try:
        db = session_manager.get_session(session_id)

    except KeyError as exc:
        raise HTTPException(
            status_code=404,
            detail="Database session not found",
        ) from exc

    return db.get_schema()


@router.post(
    "/session",
    response_model=DatabaseSession,
)
def create_database_session(
    request: DatabaseSessionRequest,
):
    config = DatabaseConfig(
        database_type=request.database_type,
        connection_url=request.connection_url,
    )

    db = create_database_adapter(config)

    try:
        db.connect()

    except DatabaseConnectionError as exc:
        db.close()

        raise HTTPException(
            status_code=503,
            detail=str(exc),
        ) from exc

    session_id = session_manager.create_session(db)

    return DatabaseSession(
        session_id=session_id,
        database_type=request.database_type,
    )

@router.post(
    "/execute",
    response_model=QueryResponse,
)
def execute_query(request: QueryRequest):
    try:
        db = session_manager.get_session(
            request.session_id
        )

    except KeyError as exc:
        raise HTTPException(
            status_code=404,
            detail="Database session not found",
        ) from exc

    result = db.execute_query(request.sql)

    return QueryResponse(
        success=True,
        columns=result["columns"],
        rows=result["rows"],
    )