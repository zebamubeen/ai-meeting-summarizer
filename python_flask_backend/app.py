"""
AI Meeting Summarizer - Python Flask Backend Reference
Author: 5th Semester CSE Major Project
Purpose: Demonstrates backend API implementation using Python Flask and Google GenAI SDK.

Endpoints:
  GET  /api/health      - Verifies backend server and API key status
  POST /api/transcribe  - Converts MP3/WAV audio to text using Gemini Speech-to-Text
  POST /api/summarize   - Analyzes meeting transcript and extracts summary + action items
"""

import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
from google.genai import types

# 1. Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS) for frontend React client
CORS(app)

# 2. Initialize Google GenAI client securely with GEMINI_API_KEY
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None


@app.route("/api/health", methods=["GET"])
def health_check():
    """Simple health check endpoint to verify backend status and API key presence."""
    return jsonify({
        "status": "ok",
        "has_api_key": bool(api_key),
        "service": "AI Meeting Summarizer (Python Flask)",
        "models": {
            "transcription": "gemini-3.5-transcribe",
            "summarization": "gemini-3.8-flash"
        }
    })


@app.route("/api/transcribe", methods=["POST"])
def transcribe_audio():
    """
    Feature 1: Speech-to-Text Audio Transcription
    Accepts: JSON { "audioBase64": "<base64_string>", "mimeType": "audio/mp3" }
    Returns: JSON { "success": True, "transcript": "<text>" }
    """
    try:
        if not client:
            return jsonify({"error": "GEMINI_API_KEY is not configured on the server."}), 500

        data = request.get_json() or {}
        audio_base64 = data.get("audioBase64")
        mime_type = data.get("mimeType", "audio/mp3")

        if not audio_base64:
            return jsonify({"error": "Missing audioBase64 payload."}), 400

        # Remove data URI header if present
        if ";base64," in audio_base64:
            audio_base64 = audio_base64.split(";base64,")[1]

        prompt_instruction = (
            "Transcribe this meeting audio accurately into clean, well-formatted English text. "
            "Include speaker labels (Speaker 1, Speaker 2 or names if spoken) when possible. "
            "Do not omit any discussed tasks, numbers, or deadlines."
        )

        # Call Gemini 3.5 Transcribe model
        response = client.models.generate_content(
            model="gemini-3.5-transcribe",
            contents=[
                types.Part.from_bytes(
                    data=bytes(audio_base64, "utf-8"),
                    mime_type=mime_type,
                ),
                prompt_instruction
            ]
        )

        transcript = response.text or ""
        return jsonify({
            "success": True,
            "transcript": transcript.strip()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/summarize", methods=["POST"])
def summarize_meeting():
    """
    Feature 3 & 4: Meeting Summarization & Action Item Extraction
    Accepts: JSON { "transcript": "<text>", "meetingTitle": "<title>" }
    Returns: JSON { "success": True, "data": { meetingTitle, shortSummary, ... } }
    """
    try:
        if not client:
            return jsonify({"error": "GEMINI_API_KEY is not configured on the server."}), 500

        data = request.get_json() or {}
        transcript = data.get("transcript", "").strip()
        meeting_title = data.get("meetingTitle", "General Meeting")

        if not transcript:
            return jsonify({"error": "Transcript cannot be empty."}), 400

        system_instruction = (
            "You are an expert AI Meeting Analyst and Executive Secretary. "
            "Analyze the provided meeting transcript with high fidelity and precision.\n"
            "CRITICAL RULES:\n"
            "1. Create a clear, concise meeting summary capturing the overall purpose and outcome.\n"
            "2. Identify all key discussion points.\n"
            "3. Highlight key decisions officially agreed upon.\n"
            "4. Extract concrete action items discussed in the meeting. For each action item:\n"
            "   - Task: Clear, actionable description.\n"
            "   - Assignee: The exact person or team assigned. If no one is mentioned, explicitly state 'Unassigned'. DO NOT invent names.\n"
            "   - Deadline: The exact deadline or timeframe if mentioned. If not mentioned, explicitly state 'Not specified'. DO NOT invent dates.\n"
            "   - Status: Always set the initial status to 'Pending'.\n"
            "   - Priority: Assign 'High', 'Medium', or 'Low' based on urgency mentioned in the transcript.\n"
            "5. Strictly adhere to facts in the transcript. Do NOT hallucinate or assume unstated commitments."
        )

        prompt = f"Meeting Title: {meeting_title}\n\nTranscript:\n\"\"\"\n{transcript}\n\"\"\""

        # Request structured JSON output using gemini-3.8-flash with fallback
        models_to_try = ["gemini-3.8-flash", "gemini-3.1-flash-lite"]
        response_text = None
        last_error = None

        for model_name in models_to_try:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=system_instruction,
                        response_mime_type="application/json"
                    )
                )
                if response.text:
                    response_text = response.text
                    break
            except Exception as e:
                last_error = e

        if not response_text:
            raise last_error or Exception("Failed to generate summary.")

        parsed_data = json.loads(response_text)
        return jsonify({
            "success": True,
            "data": parsed_data
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Flask backend running on http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
