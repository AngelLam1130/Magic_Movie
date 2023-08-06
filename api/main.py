from flask import Flask, jsonify, send_file
from flask_cors import CORS, cross_origin
import torch
import tempfile
import os

from model import load_model, invert_audio

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Main
model, processor = load_model()

@app.route("/")
@cross_origin()
def api_home():
    return jsonify({
        "message": "Welcome to R.A.C.K. API!"
        })


@app.route("/invert_audio", methods=["POST"])
@cross_origin()
def invert_audio():
    audio_input_file = request.files['file']
    save_dir = tempfile.TemporaryDirectory().name
    save_path = os.path.join(save_dir, audio_input_file.filename)

    audio_input_file.save(save_path)
    

    output_file = invert_audio(
        model, processor, save_path, normalize=True, flip_input=True, flip_output=False)

    return send_file(output_file)
