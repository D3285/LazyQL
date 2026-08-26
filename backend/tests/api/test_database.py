from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_get_database_schema():
    response = client.get("/database/schema")

    assert response.status_code == 200

    data = response.json()

    assert data["database_type"] == "sqlite"

    table_names = [
        table["name"]
        for table in data["tables"]
    ]

    assert "employees" in table_names
    assert "departments" in table_names