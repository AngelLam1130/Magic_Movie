import React, { useContext, memo ,useState} from 'react'
import { Context } from '../hooks/useStore'
import './UploadedMusic.css'

const UploadedMusic = ({}) => {
    const[file,setFile] = useState()
    const {  } = useContext(Context)

    function handleDownload(e) {
        //need to be changed
    }

    function handleUploadMusicFile() {
        const formData = new FormData()
        formData.append('file',file)
        fetch(
            'url',
            {
                method:"POST",
                body:formData
            }
        ).then((response) => response.json())
        .then(
            (result)=>{
                console.log('success',result)
            }
        )
        .catch(error => {
            console.error("Error:",error)
        })
    }

    function handleMusicFile(event) {
        setFile(event.target.files[0]);
        // Handle the selected file, e.g., upload it to the server or process it
        console.log(event.target.files[0]);
    }

    return (
        <nav className="UploadedMusicBar">
            <form onSubmit={handleUploadMusicFile}>
                <input type="file" name="file" className="form_element" onChange={handleMusicFile} />
                <button className="form_element uploadButton">Generate from Uploaded Music</button>
            </form>
            <div className="optionChoice">
                <h3>Music Version 1</h3>
                <button className="form_element" onClick={handleDownload}>
                    <span>Download</span>
                </button>
            </div>
            <div className="optionChoice">
                <h3>Music Version 2</h3>
                <button className="form_element" onClick={handleDownload}>
                    <span>Download</span>
                </button>
            </div>
            <div className="optionChoice">
                <h3>Music Version 3</h3>
                <button className="form_element" onClick={handleDownload}>
                    <span>Download</span>
                </button>
            </div>
        </nav>
    )
}

export default memo(UploadedMusic)
