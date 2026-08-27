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
    session_response = client.post(
        "/database/session",
        json={
            "database_type": "sqlite",
            "connection_url": str(DATABASE_PATH),
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


def test_database_session_connection_error():
    response = client.post(
        "/database/session",
        json={
            "database_type": "sqlite",
            "connection_url": (
                "Z:/this/path/does/not/exist/"
                "database.db"
            ),
        },
    )

    assert response.status_code == 503

    data = response.json()

    assert data["detail"] == (
        "Unable to connect to SQLite database"
    )