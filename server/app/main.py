from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.database import router as database_router
from app.api.routes.generate import router as generate_router


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://lazy-ql-git-main-aditya-aryan-26-projects1.vercel.app",
        "https://lazy-ql.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(database_router)
app.include_router(generate_router)

@app.get("/")
def health():
    return {
        "status": "ok",
        "service": "LazyQL",
    }
