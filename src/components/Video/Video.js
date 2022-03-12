import React from 'react'

function Video() {
    return (
        <>
            <video 
    loop 
    muted 
    autoPlay
    controls={false} id="myVideo">
                <source src={"config/images/video.mp4"} type="video/mp4" />
            </video>
        </>
    )
}

export default Video