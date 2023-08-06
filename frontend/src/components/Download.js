import React, { useContext, memo } from 'react'
import { Context } from '../hooks/useStore'
import './Download.css'

const Download = ({
    
}) => {
    const {  } = useContext(Context)

    function handleDownload(e) {
        //need to be changed
    }

    function handleGenerate(e) {
        // setBPM(e.target.value)
        // need to be changed
    }

    return (
        <nav className="downloadBar">
            <button className="generate" onClick={handleGenerate}>Generate</button>
            <div className="optionChoice">
                <h3>Music Version 1</h3>
                <button className="download" onClick={handleDownload}>
                    <span>Download</span>
                </button>
            </div>
            <div className="optionChoice">
                <h3>Music Version 2</h3>
                <button className="download" onClick={handleDownload}>
                    <span>Download</span>
                </button>
            </div>
            <div className="optionChoice">
                <h3>Music Version 3</h3>
                <button className="download" onClick={handleDownload}>
                    <span>Download</span>
                </button>
            </div>
        </nav>
    )
}

export default memo(Download)
