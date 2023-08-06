import React from 'react'
import './Steps.css'

const Steps = ({ count = 0 }) => {
    console.log("count");
    console.log(count);
    // let content = [...Array(count)].map((el, i) => <div className="step" key={i + 1}>{i + 1}</div>)

    return (
        <div className="steps">
            {/* {content} */}
        </div>
    )
}

export default Steps

