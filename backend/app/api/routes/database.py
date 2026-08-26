from pathlib import Path

from fastapi import APIRouter

from app.database.connection import create_database_adapter

router = APIRouter(
    prefix="/database",
    tags=["database"],
)


DATABASE_PATH = (
    Path(__file__).resolve().parents[4]
    / "database"
    / "samples"
    / "company.db"
)


@router.get("/schema")
def get_schema():
    db = create_database_adapter(
        "sqlite",
        str(DATABASE_PATH),
    )

    try:
        db.connect()
        return db.get_schema()
    finally:
        db.close()