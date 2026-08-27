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


def test_execute_query():
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
        "/database/execute",
        json={
            "session_id": session_id,
            "sql": (
                "SELECT name, salary "
                "FROM employees "
                "ORDER BY salary DESC"
            ),
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["success"] is True
    assert data["columns"] == [
        "name",
        "salary",
    ]

    assert len(data["rows"]) == 3


def test_execute_query_invalid_session():
    response = client.post(
        "/database/execute",
        json={
            "session_id": "does-not-exist",
            "sql": "SELECT 1",
        },
    )

    assert response.status_code == 404