from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_create_sqlite_session(tmp_path):
    database_path = tmp_path / "test.db"

    # Create a valid SQLite database
    database_path.touch()

    with database_path.open("rb") as file:
        response = client.post(
            "/database/session",
            data={
                "database_type": "sqlite",
            },
            files={
                "file": (
                    database_path.name,
                    file,
                    "application/octet-stream",
                )
            },
        )

    assert response.status_code == 200

    data = response.json()

    assert data["session_id"]
    assert data["database_type"] == "sqlite"