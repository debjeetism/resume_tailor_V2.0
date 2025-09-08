import pdfplumber
from fastapi import APIRouter, UploadFile, Form, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from app.database.database import get_db
from app.models import Resume
from app.schemas import ResumeOut
from app.utils.security import get_current_user
from app.utils.ai import tailor_resume
from app.utils.pdf import build_resume_pdf

router = APIRouter()

@router.post("/process", response_model=ResumeOut)
async def process_resume(
    resume: UploadFile,
    jobDescription: str = Form(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Parse PDF -> text
    if resume.content_type not in ("application/pdf",):
        raise HTTPException(status_code=400, detail="Only PDF resumes are supported in this endpoint")

    with pdfplumber.open(resume.file) as pdf:
        extracted = "\n".join([page.extract_text() or "" for page in pdf.pages])

    # Call LLM
    result = tailor_resume(extracted, jobDescription)

    # Save to DB
    entry = Resume(
        original_text=extracted,
        tailored_text=json.dumps(result.get("tailored_resume", "")),
        cover_letter=json.dumps(result.get("cover_letter", "")),
        job_description=jobDescription,
        owner_id=current_user.id
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)

    return entry

@router.get("/history")
def history(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    items = db.query(Resume).filter(Resume.owner_id == current_user.id).order_by(Resume.created_at.desc()).all()
    # FastAPI can serialize ORM directly, but you can also shape as dicts if you prefer
    return {"items": items}

@router.post("/export/{resume_id}")
def export_pdf(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    rec = db.query(Resume).filter(Resume.id == resume_id, Resume.owner_id == current_user.id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Resume not found")

    return build_resume_pdf(rec.tailored_text or "", rec.cover_letter or "", filename=f"tailored_resume_{resume_id}.pdf")
