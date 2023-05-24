import React, { useEffect, useRef } from 'react';

function VideoFrame({stream, closeBigFrame}) {

    const videoRef = useRef();

    useEffect(() => {
        if (stream) {
          const videoElement = videoRef.current;
          stream.play(videoElement.id);
        }
      }, [stream]);
    

    return (
        <div className='col-lg-12 d-flex justify-content-center flex-column align-items-center video-wrapper'>
            <video className='col-lg-7 col-md-9 col-12 video-player rounded'  ref={videoRef} id="largeFrame"></video>
            <button onClick={closeBigFrame} className=' rounded-circle btn btn-secondary my-1'><i className="fa-sharp fa-solid fa-xmark fs-5"></i></button>
        </div>
    )
}

export default VideoFrame