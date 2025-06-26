from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from services.chatbot import get_chatbot_response
from services.summarizer import summarize_text
from services.translator import translate_text
from services.email_writer import write_email
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatbotRequest(BaseModel):
    prompt: str

class SummarizerRequest(BaseModel):
    text: str

class TranslatorRequest(BaseModel):
    text: str
    target_language: str

class EmailWriterRequest(BaseModel):
    description: str

@app.post("/chatbot")
async def chatbot_endpoint(request: ChatbotRequest):
    try:
        response = await get_chatbot_response(request.prompt)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/summarize")
async def summarizer_endpoint(request: SummarizerRequest):
    try:
        summary = await summarize_text(request.text)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/translate")
async def translator_endpoint(request: TranslatorRequest):
    try:
        translation = await translate_text(request.text, request.target_language)
        return {"translation": translation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/write-email")
async def email_writer_endpoint(request: EmailWriterRequest):
    try:
        email = await write_email(request.description)
        return {"email": email}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


