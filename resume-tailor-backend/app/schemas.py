from pydantic import BaseModel, EmailStr
from typing import Optional, List

# ---------- Auth ----------
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# ---------- Resume ----------
class ResumeCreate(BaseModel):
    original_text: str
    job_description: str

class ResumeOut(BaseModel):
    id: int
    original_text: str
    tailored_text: Optional[str]
    cover_letter: Optional[str]
    job_description: str
    class Config:
        from_attributes = True

class ResumeList(BaseModel):
    items: List[ResumeOut]
