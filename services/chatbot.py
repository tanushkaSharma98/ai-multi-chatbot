import os
import httpx
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=GEMINI_API_KEY"
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"


async def get_chatbot_response(prompt: str) -> str:
    formatted_prompt = f"""
{prompt}

Please respond clearly with:
- Paragraphs
- Line breaks
- Bullet points if listing
- Friendly and conversational tone
"""

# formatted_prompt = (
#     f"{prompt}\n\n"
#     "Please respond clearly with:\n"
#     "- Paragraphs\n"
#     "- Line breaks\n"
#     "- Bullet points if listing\n"
#     "- Friendly and conversational tone"
# )

    headers = {"Content-Type": "application/json"}
    params = {"key": GEMINI_API_KEY}
    data = {
        "contents": [{"parts": [{"text": formatted_prompt}]}]
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(GEMINI_API_URL, headers=headers, params=params, json=data)
        try:
            response.raise_for_status()
            result = response.json()
            if "candidates" in result and result["candidates"]:
                return result["candidates"][0]["content"]["parts"][0]["text"]
            else:
                return "The AI could not process your request. Please try again with less text or check your API key."
        except Exception as e:
            return f"Error from Gemini API: {str(e)}"


