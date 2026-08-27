from pathlib import Path

from app.database.connection import create_database_adapter
from app.models.database import DatabaseConfig


DATABASE_PATH = (
    Path(__file__).resolve().parents[3]
    / "database"
    / "samples"
    / "company.db"
)


def test_demo_database_schema():
    config = DatabaseConfig(
        database_type="sqlite",
        connection_url=str(DATABASE_PATH),
    )

    db = create_database_adapter(config)

    db.connect()

    schema = db.get_schema()

    table_names = [
        table.name
        for table in schema.tables
    ]

    assert "employees" in table_names
    assert "departments" in table_names

    db.close()


def test_demo_database_query():
    config = DatabaseConfig(
        database_type="sqlite",
        connection_url=str(DATABASE_PATH),
    )

    db = create_database_adapter(config)

    db.connect()

    result = db.execute_query(
        "SELECT name, salary FROM employees ORDER BY salary DESC"
    )

    assert result["columns"] == ["name", "salary"]
    assert len(result["rows"]) == 3
    assert result["rows"][0][0] == "Priya"

    db.close()