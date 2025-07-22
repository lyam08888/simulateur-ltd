from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# Configuration Gemini avec clé API
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise EnvironmentError("❌ La clé GEMINI_API_KEY est manquante dans les variables d’environnement.")

genai.configure(api_key=api_key)
model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

@app.route("/api/gemini", methods=["POST"])
def api_gemini():
    data = request.get_json()
    prompt = data.get("prompt", "").strip()

    # Vérifie que le prompt n'est pas vide
    if not prompt:
        return jsonify({"error": "❗ Le prompt est vide. Merci d’écrire une demande."}), 400

    try:
        response = model.generate_content(prompt)
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"error": f"Erreur lors de la génération : {str(e)}"}), 500

@app.route("/")
def home():
    return "<h2>🚀 Serveur IA Gemini Flash 1.5 opérationnel !</h2>"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
