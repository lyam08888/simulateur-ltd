import os
import google.generativeai as genai

api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-pro")
response = model.generate_content("Dis-moi une blague propre et drôle.")

print(response.text)
