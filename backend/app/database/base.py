from abc import ABC, abstractmethod


class DatabaseAdapter(ABC):

    @abstractmethod
    def connect(self):
        pass

    @abstractmethod
    def get_schema(self):
        pass

    @abstractmethod
    def execute_query(self, sql: str):
        pass

    @abstractmethod
    def close(self):
        pass