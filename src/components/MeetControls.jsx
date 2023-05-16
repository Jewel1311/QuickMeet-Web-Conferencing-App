import React from 'react'

function MeetControls({toggleChat, showChat, closeCall, micButton, audioState, videoState, videoButton }) {

  const chatBtnClass = `${showChat ?'btn-info':'btn-secondary'} btn col-md-block d-lg-none rounded-circle mx-2 chatbtn` 

  return (
    <div className='controls d-flex justify-content-center align-items-center'>
      
      {videoState ? 
      <button className='border-none btn btn-info rounded-circle mx-2' onClick={videoButton}><i className="fa-solid fa-video"></i></button>
      :
      <button className='border-none btn btn-secondary rounded-circle mx-2' onClick={videoButton}><i className="fa-solid fa-video-slash fs-6"></i>
      </button>
      }

      {audioState ? 
      <button className='border-none btn btn-info rounded-circle mx-2' onClick={micButton}><i className="fa-solid fa-microphone"></i></button> 
      : 
      <button className='border-none btn btn-secondary rounded-circle mx-2' onClick={micButton}><i className="fa-solid fa-microphone-slash fs-6"></i></button>
      }

      
      <button className='border-none btn btn-danger rounded-circle mx-2' onClick={closeCall}><i className="fa-solid fa-phone-slash"></i></button>

      <button className={chatBtnClass} data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" onClick={toggleChat}>
      <i className="fa-solid fa-comment"></i>
      </button>

    </div>
  )
}

export default MeetControls