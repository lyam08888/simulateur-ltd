from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import google.generativeai as genai

app = Flask(__name__)
CORS(app)  # ✅ active CORS pour autoriser les appels externes

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

@app.route("/api/gemini", methods=["POST"])
def api_gemini():
    prompt = request.json.get("prompt", "")
    response = model.generate_content(prompt)
    return jsonify({"response": response.text})

@app.route("/")
def home():
    return "<h2>Serveur IA en ligne ✅</h2>"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
