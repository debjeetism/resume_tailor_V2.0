import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# NOTE: To connect to PostgreSQL, you must install the driver:
# pip install psycopg2-binary

# Load environment variables from .env file
load_dotenv()

# Get the database URL from the environment.
# If you set DATABASE_URL in your .env file, it will be used.
# Otherwise, it falls back to the SQLite default.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./resume_tailor.db")

# This logic is already correct!
# For PostgreSQL, DATABASE_URL will not start with "sqlite",
# so connect_args will correctly be an empty {}.
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def init_db():
    # Import models here so tables are registered before create_all
    from app import models  # noqa: F401
    Base.metadata.create_all(bind=engine)

# FastAPI dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
