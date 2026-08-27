from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)

DATABASE_PATH = (
    Path(__file__).resolve().parents[3]
    / "database"
    / "samples"
    / "company.db"
)


def test_get_database_schema():
    with DATABASE_PATH.open("rb") as file:
        session_response = client.post(
            "/database/session",
            data={
                "database_type": "sqlite",
            },
            files={
                "file": (
                    DATABASE_PATH.name,
                    file,
                    "application/octet-stream",
                )
            },
        )

    assert session_response.status_code == 200

    session_id = session_response.json()["session_id"]

    response = client.post(
        "/database/schema",
        params={
            "session_id": session_id,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["database_type"] == "sqlite"

    table_names = [
        table["name"]
        for table in data["tables"]
    ]

    assert "employees" in table_names
    assert "departments" in table_names


def test_database_session_connection_error(tmp_path):
    invalid_file = tmp_path / "invalid.db"

    invalid_file.write_text(
        "this is not a sqlite database"
    )

    with invalid_file.open("rb") as file:
        response = client.post(
            "/database/session",
            data={
                "database_type": "sqlite",
            },
            files={
                "file": (
                    invalid_file.name,
                    file,
                    "application/octet-stream",
                )
            },
        )

    assert response.status_code == 503

    data = response.json()

    assert data["detail"] == (
        "Unable to connect to SQLite database"
    )