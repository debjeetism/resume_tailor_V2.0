import io
import json
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem

def clean_text(text) -> str:
    """Remove surrounding quotes and unescape newlines if stored as JSON string or dict."""
    # If dict, try common keys
    if isinstance(text, dict):
        for key in ["content", "text", "value"]:
            if key in text:
                text = text[key]
                break
        else:
            text = str(text)
    elif not isinstance(text, str):
        text = str(text)
    # If string is a JSON object, try to parse and extract again
    try:
        if isinstance(text, str) and text.strip().startswith("{"):
            obj = json.loads(text)
            return clean_text(obj)
    except Exception:
        pass
    if isinstance(text, str) and text.startswith('"') and text.endswith('"'):
        text = text[1:-1]  # remove surrounding quotes
    return text.replace("\\n", "\n")

def build_resume_pdf(tailored_resume: str, cover_letter: str, filename: str = "resume.pdf"):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = styles["Heading1"]
    section_style = styles["Heading2"]
    body_style = styles["Normal"]
    bullet_style = ParagraphStyle("bullet", parent=body_style, leftIndent=20, bulletIndent=10, spaceAfter=6)

    story = []

    # ===== Tailored Resume Section =====
    story.append(Paragraph("Tailored Resume Suggestions", title_style))
    story.append(Spacer(1, 12))

    # Try to handle dict, JSON string, or plain string for tailored_resume
    suggestions = []
    projects = []
    resume_data = None
    if isinstance(tailored_resume, dict):
        resume_data = tailored_resume
    else:
        try:
            resume_data = json.loads(tailored_resume)
        except Exception:
            resume_data = None
    if resume_data and isinstance(resume_data, dict):
        keys = list(resume_data.keys())
        if keys:
            # First key's value as suggestions
            suggestions = resume_data[keys[0]] if isinstance(resume_data[keys[0]], list) else []
            if len(keys) > 1:
                # Second key's value as projects
                projects = resume_data[keys[1]] if isinstance(resume_data[keys[1]], list) else []
    # Suggestions
    if suggestions:
        story.append(Paragraph("Suggestions:", section_style))
        story.append(Spacer(1, 6))
        bullets = [ListItem(Paragraph(clean_text(s), bullet_style)) for s in suggestions]
        story.append(ListFlowable(bullets, bulletType="bullet"))
        story.append(Spacer(1, 12))
    # Projects
    if projects:
        story.append(Paragraph("Recommended Projects:", section_style))
        story.append(Spacer(1, 6))
        for proj in projects:
            if isinstance(proj, dict):
                title = proj.get("title", "")
                desc = proj.get("description", "")
                tech = proj.get("tech", "")
            else:
                title = ""
                desc = clean_text(proj)
                tech = ""
            if title:
                story.append(Paragraph(f"<b>{title}</b>", body_style))
            if desc:
                story.append(Paragraph(desc, body_style))
            if tech:
                story.append(Paragraph(f"<i>Tech Stack:</i> {tech}", body_style))
            story.append(Spacer(1, 12))
    if not suggestions and not projects:
        # If parsing fails, just dump raw text
        story.append(Paragraph(clean_text(tailored_resume).replace("\n", "<br/>"), body_style))

    story.append(Spacer(1, 24))

    # ===== Cover Letter Section =====
    story.append(Paragraph("Cover Letter", title_style))
    story.append(Spacer(1, 12))

    # Robustly handle cover_letter as dict, JSON string, or plain string
    cleaned_cover = clean_text(cover_letter)
    # Split into paragraphs by double newlines
    for para in cleaned_cover.split("\n\n"):
        clean_para = para.strip()
        if clean_para:
            story.append(Paragraph(clean_para, body_style))
            story.append(Spacer(1, 12))

    # Build PDF
    doc.build(story)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
