import pytest
from pydantic import ValidationError

from app.models.database import DatabaseConfig


def test_database_config():
    config = DatabaseConfig(
        database_type="sqlite",
        connection_url="test.db",
    )

    assert config.database_type == "sqlite"
    assert config.connection_url == "test.db"


def test_database_config_requires_fields():
    with pytest.raises(ValidationError):
        DatabaseConfig()