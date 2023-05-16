import React from 'react'

function MeetControls({toggleChat, showChat, closeCall, micButton, audioState=true}) {

  const chatBtnClass = `${showChat ?'btn-info':'btn-secondary'} btn col-md-block d-lg-none rounded-circle mx-2 chatbtn` 

  return (
    <div className='controls d-flex justify-content-center align-items-center'>
      <button className='border-none btn btn-info rounded-circle mx-2'><i className="fa-solid fa-camera"></i></button>
      {audioState ? <button className='border-none btn btn-info rounded-circle mx-2' onClick={micButton}><i className="fa-solid fa-microphone"></i></button> 
      : 
      <button className='border-none btn btn-secondary rounded-circle mx-2' onClick={micButton}><i className="fa-solid fa-microphone-slash"></i></button>
      }

      
      <button className='border-none btn btn-danger rounded-circle mx-2' onClick={closeCall}><i className="fa-solid fa-phone-slash"></i></button>

      <button className={chatBtnClass} data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" onClick={toggleChat}>
      <i className="fa-solid fa-comment"></i>
      </button>

    </div>
  )
}

export default MeetControls