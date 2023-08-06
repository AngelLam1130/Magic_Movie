from transformers import EncodecModel, AutoProcessor
import torch
from audiocraft.data.audio import audio_read, audio_write
import datetime
import IPython
import os
import julius

from transformers import EncodecModel
from typing import List, Optional, Tuple, Union

class EncodecNoQuantizeModel(EncodecModel):

    def _encode_frame(
        self, input_values: torch.Tensor, bandwidth: float, padding_mask: int
    ) -> Tuple[torch.Tensor, Optional[torch.Tensor]]:
        """
        Encodes the given input using the underlying VQVAE. If `config.normalize` is set to `True` the input is first
        normalized. The padding mask is required to compute the correct scale.
        """
        length = input_values.shape[-1]
        duration = length / self.config.sampling_rate

        if self.config.chunk_length_s is not None and duration > 1e-5 + self.config.chunk_length_s:
            raise RuntimeError(f"Duration of frame ({duration}) is longer than chunk {self.config.chunk_length_s}")

        scale = None
        if self.config.normalize:
            # if the padding is non zero
            input_values = input_values * padding_mask
            mono = torch.sum(input_values, 1, keepdim=True) / input_values.shape[1]
            scale = mono.pow(2).mean(dim=-1, keepdim=True).sqrt() + 1e-8
            input_values = input_values / scale

        embeddings = self.encoder(input_values)
        # codes = self.quantizer.encode(embeddings, bandwidth)
        # codes = codes.transpose(0, 1)
        return embeddings, scale

    def _decode_frame(self, embeddings: torch.Tensor, scale: Optional[torch.Tensor] = None) -> torch.Tensor:
        # codes = codes.transpose(0, 1)
        # embeddings = self.quantizer.decode(codes)
        outputs = self.decoder(embeddings)
        if scale is not None:
            outputs = outputs * scale.view(-1, 1, 1)
        return outputs
    

MODEL_SAMPLING_RATE = 48000

def load_model():
    # load the model + processor (for pre-processing the audio)
    model = EncodecNoQuantizeModel.from_pretrained("facebook/encodec_48khz").to("cuda:0")
    processor = AutoProcessor.from_pretrained("facebook/encodec_48khz")

    return model, processor

@torch.no_grad()
def invert_audio(
        model, processor, audio_file_path, out_path,
        normalize=True, flip_input=True, flip_output=False):

    model.config.normalize = normalize

    audio_sample_1, sampling_rate_1 = audio_read(audio_file_path)
    if sampling_rate_1 != MODEL_SAMPLING_RATE:
        audio_sample_1 = julius.resample_frac(audio_sample_1, sampling_rate_1, MODEL_SAMPLING_RATE)

    # audio_sample [2, 9399305]
    if flip_input:
        audio_sample_1 = torch.flip(audio_sample_1, dims=(1,))
    
    # pre-process the inputs
    inputs_1 = processor(raw_audio=audio_sample_1, sampling_rate=MODEL_SAMPLING_RATE, return_tensors="pt")
    inputs_1["input_values"] = inputs_1["input_values"].to("cuda:0")
    inputs_1["padding_mask"] = inputs_1["padding_mask"].to("cuda:0")

    # explicitly encode then decode the audio inputs
    print("Encoding...")
    encoder_outputs_1 = model.encode(
        inputs_1["input_values"],
        inputs_1["padding_mask"],
        bandwidth=max(model.config.target_bandwidths))

    # EMBEDDINGS (no quantized):
    # encoder_outputs.audio_codes.shape 
    # [216, 1, 128, 150]

    avg = torch.mean(encoder_outputs_1.audio_codes, (0, 3), True)
    # [1, 1, 128, 1]
    avg_repeat = avg.repeat(
        encoder_outputs_1.audio_codes.shape[0],
        encoder_outputs_1.audio_codes.shape[1],
        1,
        encoder_outputs_1.audio_codes.shape[3])
    # [216, 1, 128, 150]
    diff_repeat = encoder_outputs_1.audio_codes - avg_repeat
    
    # TODO: power factor calculations kinda useless if we keep the factor one???
    POWER_FACTOR = 1
    max_abs_diff = torch.max(torch.abs(diff_repeat))
    diff_abs_power = ((torch.abs(diff_repeat) / max_abs_diff) ** POWER_FACTOR) * max_abs_diff
    latents = (diff_repeat >= 0) * diff_abs_power - (diff_repeat < 0) * diff_abs_power

    # difference inversion done here!
    latents = latents * -1.0

    print("Decoding...")
    audio_values = model.decode(latents, encoder_outputs_1.audio_scales, inputs_1["padding_mask"])[0]

    # [1, 2, 10264800]
    if flip_output:
        audio_values = torch.flip(audio_values, dims=(2,))

    output_dir = "/home/romainpaulusisep_gmail_com/data/outputs"
    decoded_wav = audio_values.squeeze(0).to("cpu")

    print("Saving output file...")
    out_path_ = audio_write(
        out_path,
        sample_rate=MODEL_SAMPLING_RATE,
        wav=decoded_wav,
        normalize=False)

    return out_path_
