####### USING AUDIOCRAFT ####### 

from audiocraft.models import CompressionModel, MultiBandDiffusion
import torch
from audiocraft.data.audio import audio_read, audio_write
import datetime
import IPython
import os
import julius

bandwidth = 3.0

def main():

    print("Load MBD model...")
    mbd = MultiBandDiffusion.get_mbd_24khz(bw=bandwidth)

    print("Load audio file...")
    stem_1, sample_rate = audio_read("/home/romainpaulusisep_gmail_com/data/Lil Texas - Hardcore Bassdrum (Original Mix).wav")
    # stem_2, _ = audio_read("/home/romainpaulusisep_gmail_com/data/Hypho - DDD Subscriber Sample Pack - 41 Hypho - Loop - Piano Lead.wav")
    # ([2, 9399305], 44100)

    # Double the sample rate => Slow it down by 2
    working_sample_rate = sample_rate * 2
    stem_1 = julius.resample_frac(stem_1, sample_rate, working_sample_rate).squeeze(0)
    print("STEM 1 SHAPE")
    print(stem_1)

    # Shorten it to 60 seconds
    trim_time_seconds = 60
    stem_1 = stem_1[: , :working_sample_rate * trim_time_seconds]

    # make them the same length
    # min_len = min(stem_1.shape[1], stem_2.shape[1])
    # stem_1 = stem_1[:, :min_len]
    # stem_2 = stem_2[:, :min_len]


    # Add batch dimension
    stem_1_batch = stem_1.unsqueeze(0).to("cuda:0")
    # stem_2_batch = stem_2.unsqueeze(0).to("cuda:0")
    # shape [1, 2, 9399305]

    # CHUNK_SIZE = 88050

    # Encode left and right separately (apparently that's how EnCodec works)
    with torch.no_grad():
        print("Encode...")

        # Drums
        embs_1_encoded_left = mbd.get_condition(stem_1_batch[:, 0:1, :], sample_rate=sample_rate)

        # Piano
        # embs_2_encoded_left = mbd.get_condition(stem_2_batch[:, 0:1, :], sample_rate=sample_rate)
        # vv_encoded_left[0].shape [1, 128, 15986]

        # Do funky stuff to the embeddings
        embs_encoded_left = embs_1_encoded_left

        embs_encoded_left_avg = torch.mean(embs_encoded_left.squeeze(0), 1, True)
        embs_encoded_left_avg_repeat = embs_encoded_left_avg.repeat(1, embs_encoded_left.shape[2]).unsqueeze(0)

        embs_encoded_left_diff = embs_encoded_left - embs_encoded_left_avg_repeat
        
        mean_diff = torch.mean(embs_encoded_left_diff.squeeze(0), 1)

        sort_diff = torch.argsort(torch.mean(embs_encoded_left_diff.squeeze(0), 1), descending=True)
        bottom_10 = sort_diff

        # invert the diff, but keep the lowest changing in the right orientation

        # GOOD ONE!!!
        # embs_encoded_left = embs_encoded_left - embs_encoded_left_avg_repeat

        # embs_encoded_left = embs_encoded_left_diff


        print("Decode...")
        # vv_decoded = model.decode(vv_encoded[0])
        vv_decoded_left = mbd.generate(embs_encoded_left)

        # vv_decoded_left = julius.resample_frac(vv_decoded_left, mbd.sample_rate, sample_rate)

    print("Save file...")
    output_dir = "/home/romainpaulusisep_gmail_com/data/outputs"
    decoded_wav = vv_decoded_left.squeeze(0).to("cpu")
    out_path = audio_write(
        os.path.join(output_dir, "blk-333-decoded"),
        sample_rate=mbd.sample_rate * 2,
        wav=decoded_wav,
        normalize=False)

    # print("Show player...")
    # import IPython
    # IPython.display.Audio(out_path)


if __name__ == "__main__":
    main()
