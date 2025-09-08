from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database.database import init_db
from app.routers import auth, resume

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title="AI Resume Tailor",
    version="1.0.0",
    lifespan=lifespan
)

# CORS (lock this down to your frontend origin in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(resume.router, prefix="/resume", tags=["Resume"])

@app.get("/")
def root():
    return {"message": "Welcome to AI Resume Tailor Backend 🚀"}
