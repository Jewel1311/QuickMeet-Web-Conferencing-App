import React from 'react'

function MeetControls({ closeCall, micButton, audioState, videoState, videoButton, shareScreen, showCamera, shareState }) {

  return (
    <div className='controls d-flex justify-content-center align-items-center'>

      {showCamera &&
        <>
          {videoState ?
            <button className='border-none btn btn-info rounded-circle mx-2' onClick={videoButton}><i className="fa-solid fa-video"></i></button>
            :
            <button className='border-none btn btn-secondary rounded-circle mx-2' onClick={videoButton}><i className="fa-solid fa-video-slash fs-6"></i>
            </button>
          }
        </>
      }

      {audioState ?
        <button className='border-none btn btn-info rounded-circle mx-2' onClick={micButton}><i className="fa-solid fa-microphone"></i></button>
        :
        <button className='border-none btn btn-secondary rounded-circle mx-2' onClick={micButton}><i className="fa-solid fa-microphone-slash fs-6"></i></button>
      }


      <button className='border-none btn btn-danger rounded-circle mx-2' onClick={closeCall}><i className="fa-solid fa-phone-slash"></i></button>

      {shareState ? 
      <button className='border-none btn btn-info rounded-circle mx-2' onClick={shareScreen}><i className="fa-solid fa-display"></i></button>
      :
      <button className='border-none btn btn-secondary rounded-circle mx-2' onClick={shareScreen}><i className="fa-solid fa-display"></i></button>
      }
    </div>
  )
}

export default MeetControls