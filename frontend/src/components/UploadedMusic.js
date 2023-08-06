import React, { useContext, memo ,useState} from 'react'
import { Context } from '../hooks/useStore'
import './UploadedMusic.css'

const UploadedMusic = ({}) => {
    const[file,setFile] = useState()
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

    function handleUploadMusicFile() {
        const formData = new FormData();
        formData.append('file', file);

        // Replace 'uploadUrl' with the actual endpoint to handle file upload
        const uploadUrl = 'uploadUrl';

        fetch(uploadUrl, {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((result) => {
                console.log('Upload success:', result);
            // Perform any other actions after successful upload, if needed
            })
            .catch((error) => {
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
            {/* <div className="uploadHeader">
                <h1 className="uploadTitle">Customize Your Own Music</h1>
            </div>
            <div class="line"></div> */}
            <form onSubmit={handleUploadMusicFile}>
                <div className="form_container">
                    <input type="file" name="file" className="form_element" onChange={handleMusicFile} />
                    <button className="form_element" type="submit">Generate from Uploaded Music</button>
                </div>
            </form>
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
        </nav>
    )
}

export default memo(UploadedMusic)
