from pydantic import BaseModel


class DatabaseConfig(BaseModel):
    database_type: str
    connection_url: str