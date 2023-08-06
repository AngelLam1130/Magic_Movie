from flask import Flask, jsonify, send_file, request
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

    with tempfile.TemporaryDirectory() as save_dir:
        input_audio_path = os.path.join(save_dir, audio_input_file.filename)
        audio_input_file.save(input_audio_path)

        output_audio_path = os.path.join(save_dir, "inverted-" + audio_input_file.filename)

        output_file = invert_audio(
            model, processor, input_audio_path, out_path=output_audio_path,
            normalize=True, flip_input=True, flip_output=False)

        return send_file(output_file)
