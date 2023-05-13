import React from 'react'
import JoinForm from '../components/JoinForm'

function JoinRoom() {

  const handleJoin = (data) => {
    
  }


  return (
    <div className='vh-100 d-flex align-items-center justify-content-center'>
        <JoinForm handleJoin={handleJoin} />
    </div>
  )
}

export default JoinRoom