from uuid import uuid4

from .base import DatabaseAdapter


class DatabaseSessionManager:

    def __init__(self):
        self._sessions: dict[str, DatabaseAdapter] = {}

    def create_session(
        self,
        adapter: DatabaseAdapter,
    ) -> str:
        session_id = str(uuid4())

        self._sessions[session_id] = adapter

        return session_id

    def get_session(
        self,
        session_id: str,
    ) -> DatabaseAdapter:
        if session_id not in self._sessions:
            raise KeyError(
                f"Unknown database session: {session_id}"
            )

        return self._sessions[session_id]

    def close_session(
        self,
        session_id: str,
    ) -> None:
        adapter = self._sessions.pop(
            session_id,
            None,
        )

        if adapter:
            adapter.close()