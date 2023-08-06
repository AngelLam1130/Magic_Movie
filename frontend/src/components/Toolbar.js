import React, { useContext, memo, useState } from 'react'
import { sequenceList } from '../constants/config'
import { Context } from '../hooks/useStore'
import './Toolbar.css'

const ToolBar = ({
    setStartTime,
    setPastLapse,
    setBPM,
    isSequencePlaying,
    startTime,
    BPM
}) => {
    const[file,setFile] = useState()
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

    function convertSequenceListToMatrix(list) {
        const matrices = {};

        for (const sequence of list) {
            const title = sequence.title;
            const matrix = [];
            for (const track of sequence.trackList) {
                let zeroArray = new Array(sequence.noteCount).fill(0);
                const notes = track.onNotes;
                for (const note of notes) {
                    zeroArray[note] = 1;
                }
                matrix.push(zeroArray);
            }
            matrices[title] = matrix;
        }
        return matrices;
    }

    function sendToBackend() {

        let matrices = convertSequenceListToMatrix(sequenceList);
        console.log(matrices);

        // fetch('/myserver.endpoint', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //       // Add parameters here
        //     })
        //     headers: {
        //       'Content-type': 'application/json; charset=UTF-8',
        //     },
        //   })
        //      .then((response) => response.json())
        //      .then((data) => {
        //         console.log(data);
        //         // Handle data
        //      })
        //      .catch((err) => {
        //         console.log(err.message);
        //      });
    }
    console.log(sequenceList)

    return (
        <div className="toolbar">
            <form onSubmit={handleUploadMusicFile}>
                <input type="file" name="file" className="form_element" onChange={handleMusicFile} />
                <button className="form_element uploadButton">Upload Song</button>
            </form>
            <button className="form_element button_stop" onClick={stopPlayback} aria-label="Stop">
                <svg width="14" height="14" viewBox="0 0 14 14">
                    <rect className="button_icon_path" x="2" y="2" width="10" height="10" />
                </svg>
            </button>
            <button className="form_element button_play_pause" onClick={togglePlayback} aria-label="Play / Pause">
                <svg width="14" height="14" viewBox="8 8 20 20">
                    {isSequencePlaying && <path className="button_icon_path" id="pause-icon" data-state="playing" d="M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26" />}
                    {!isSequencePlaying && <path className="button_icon_path" id="play-icon" data-state="paused" d="M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28" />}
                </svg>
            </button>
            <button className="form_element button_play_pause" onClick={sendToBackend} aria-label="Upload">
                <rect className="button_icon_path" x="2" y="2" width="10" height="10" />
            </button>
            <input className="form_element input_bpm" id="bpm" type="text" value={BPM} onChange={updateBPM} />
            <label className="label_bpm" htmlFor="bpm">BPM</label>
            <select
                className="form_element select_sequence"
                value={selectedSequenceID}
                onChange={e => selectSequence(+e.target.value)}
                aria-label="Select sequence"
            >
                {
                    sequenceList.map(seq => {
                        return (
                            <option
                                key={seq.id}
                                value={seq.id}
                            >
                                {seq.title}
                            </option>
                        )
                    })
                }
            </select>
        </div>
    )
}

export default memo(ToolBar)
