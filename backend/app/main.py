from fastapi import FastAPI

from app.api.routes.database import router as database_router

app = FastAPI(
    title="LazyQL API",
    version="0.1.0",
)

app.include_router(database_router)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "LazyQL",
    }