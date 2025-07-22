from flask import Flask, request, jsonify
import os
import google.generativeai as genai

app = Flask(__name__)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

@app.route("/")
def index():
    return '''
    <h2>Gemini Flash 1.5</h2>
    <input id="prompt" placeholder="Pose une question">
    <button onclick="send()">Envoyer</button>
    <pre id="output"></pre>
    <script>
      function send() {
        fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: document.getElementById('prompt').value })
        })
        .then(res => res.json())
        .then(data => {
          document.getElementById('output').textContent = data.response;
        });
      }
    </script>
    '''

@app.route("/api/gemini", methods=["POST"])
def ask_gemini():
    data = request.get_json()
    prompt = data.get("prompt", "")
    response = model.generate_content(prompt)
    return jsonify({"response": response.text})

if __name__ == "__main__":
    app.run(debug=True)
