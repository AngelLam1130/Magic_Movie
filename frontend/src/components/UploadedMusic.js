import React, { useContext, memo ,useState} from 'react'
import { Context } from '../hooks/useStore'
import './UploadedMusic.css'

const INVERT_AUDIO_ENDPOINT = "http://34.86.80.211:8080/invert_audio"

const UploadedMusic = ({}) => {
    const[file, setFile] = useState();
    const[audioUrl, setAudioUrl] = useState();
    const[pending, setPending] = useState(false);
    const {  } = useContext(Context)

    function handleDownload(version) {
        // Replace 'url' with the actual endpoint to download the processed file
        const downloadURL = `url/version/${version}`;

        fetch(downloadURL)
        .then((response) => response.blob()) // Get the response as a blob
        .then((blob) => {
            // Create a download link and trigger the download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Music_Version_${version}.mp3`);
            document.body.appendChild(link);
            link.click();
        })
        .catch((error) => {
            console.error('Error downloading file:', error);
        });
    }

    function handleUploadMusicFile(e) {
        e.preventDefault();
        if (pending) {
            return;
        }
        setPending(true);
        const formData = new FormData();
        formData.append('file', file);

        const ctx = new AudioContext();

        // Replace 'uploadUrl' with the actual endpoint to handle file upload
        const uploadUrl = INVERT_AUDIO_ENDPOINT;

        fetch(uploadUrl, {
            method: 'POST',
            body: formData,
        })
            .then(data => data.arrayBuffer())
            .then(arrayBuffer => {
                const blob = new Blob([arrayBuffer], { type: "audio/wav" });
                const audioUrl = window.URL.createObjectURL(blob);
                setAudioUrl(audioUrl);
                setPending(false);
            })
            .catch((error) => {
                setPending(false);
                console.error('Error uploading file:', error);
            });
    }

    function handleMusicFile(event) {
        setFile(event.target.files[0]);
        // Handle the selected file, e.g., upload it to the server or process it
        console.log(event.target.files[0]);
    }

    return (
        <nav className="UploadedMusicBar">
            <form onSubmit={handleUploadMusicFile}>
                <div className="form_container">
                    <input type="file" name="file" className="form_element" onChange={handleMusicFile} />
                    <button className="form_element" type="submit">{
                        pending ? "Doing neural magic..." : "Generate from Uploaded Music"
                    }</button>
                </div>
            </form>
            { audioUrl && (
                <audio id="audio" controls download>
                    <source src={audioUrl} type="audio/wav" />
                </audio>
            )}
            {/*
            <div className="optionChoice">
                <h3>Music Version 1</h3>
                <button className="form_element" onClick={() => handleDownload(1)}>Download</button>
            </div>
            <div className="optionChoice">
                <h3>Music Version 2</h3>
                <button className="form_element" onClick={() => handleDownload(2)}>Download</button>
            </div>
            <div className="optionChoice">
                <h3>Music Version 3</h3>
                <button className="form_element" onClick={() => handleDownload(3)}>Download</button>
            </div>
            */}
        </nav>
    )
}

export default memo(UploadedMusic)
