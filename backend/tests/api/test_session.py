from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_create_sqlite_session(tmp_path):
    database_path = tmp_path / "test.db"

    response = client.post(
        "/database/session",
        json={
            "database_type": "sqlite",
            "connection_url": str(database_path),
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["session_id"]
    assert data["database_type"] == "sqlite"