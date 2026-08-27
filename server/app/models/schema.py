from pydantic import BaseModel


class ColumnSchema(BaseModel):
    name: str
    type: str
    primary_key: bool


class ForeignKeySchema(BaseModel):
    column: str
    references_table: str
    references_column: str


class TableSchema(BaseModel):
    name: str
    columns: list[ColumnSchema]
    foreign_keys: list[ForeignKeySchema]


class DatabaseSchema(BaseModel):
    database_type: str
    tables: list[TableSchema]