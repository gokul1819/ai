from flask import Flask, request, jsonify
from flask_cors import CORS  # <-- Import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)  # <-- Allow React frontend to call Flask

# ✅ Correct way to set your API key
genai.configure(api_key="YOUR_API_KEY")  # Replace with your actual key

@app.route("/generate-question", methods=["POST"])
def generate_questions():
    try:
        data = request.json
        prompt = data.get("prompt", "")

        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        # Call the Generative AI model
        response = genai.models.generate(
            model="text-bison-001",
            prompt=prompt,
            temperature=0.7,
            max_output_tokens=500
        )

        return jsonify({"output": response.text})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    # Optional: run on all interfaces for easier testing
    app.run(host="0.0.0.0", port=5000, debug=True)
