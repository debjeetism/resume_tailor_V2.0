import os
import json
from openai import OpenAI


client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=os.getenv("OPENAI_API_KEY"),
)

SYSTEM_PROMPT = "You are an expert career coach."

def tailor_resume(resume_text: str, job_desc: str) -> dict:
    """
    Calls the LLM and returns a dict:
    { "tailored_resume": "...", "cover_letter": "..." }
    """
    prompt = f"""
    Given the following:

    Candidate Resume:
    {resume_text}

    Job Description:
    {job_desc}

    Tasks:
    1) Read the Resume and Job Description, then uner "tailored_resume" generate suggestions to improve the resume under the context of the job description (e.g. keywords, skills, experience). Make it more relevant to the job description. And aslo add some projects suggestions which will be better fit the job description.
    2) Generate a concise, personalized one-page cover letter (max ~300-400 words).

    Output strict JSON with keys: tailored_resume, cover_letter
    """

    resp = client.chat.completions.create(
        # model="mistralai/mistral-small-3.2-24b-instruct:free",
        # model="openai/gpt-oss-20b:free",
        model="openrouter/sonoma-dusk-alpha",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        response_format={"type": "json_object"},
        temperature=0.4,
    )
    content = resp.choices[0].message.content
    return json.loads(content)
