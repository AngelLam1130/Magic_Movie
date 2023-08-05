import React, { useContext, memo } from 'react'
import { sequenceList } from '../constants/config'
import { Context } from '../hooks/useStore'
import './Download.css'

const Download = ({
    setStartTime,
    setPastLapse,
    setBPM,
    isSequencePlaying,
    startTime,
    BPM
    // need to be changed
}) => {
    const { sequence: { id: selectedSequenceID }, selectSequence } = useContext(Context)

    function togglePlayback() {
        if (isSequencePlaying) {
            setPastLapse(l => l + performance.now() - startTime)
            setStartTime(null)
        } else {
            setStartTime(performance.now())
        }
    }

    function stopPlayback() {
        setPastLapse(0)
        setStartTime(null)
    }

    function updateBPM(e) {
        setBPM(e.target.value)
    }

    function handleDownload(e) {
        setBPM(e.target.value)
    }

    function handleGenerate(e) {
        setBPM(e.target.value)
    }

    return (
        <nav className="downloadBar">
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
