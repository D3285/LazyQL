from pydantic import BaseModel


class DatabaseSession(BaseModel):
    session_id: str
    database_type: str
    
class DatabaseSessionRequest(BaseModel):
    database_type: str
    connection_url: str
    
class QueryRequest(BaseModel):
    session_id: str
    sql: str


class QueryResponse(BaseModel):
    success: bool
    columns: list[str]
    rows: list[list]