import React from 'react'
import JoinForm from '../components/JoinForm'
import { useNavigate } from 'react-router-dom'


function JoinRoom({setData}) {
  const navigate = useNavigate()

  const handleJoin = (data) => {
    //pass the name and meeting id coming form JoinForm component to MainRoom component
    setData(data)
    navigate("/meet");
  }


  return (
    <div className='vh-100 d-flex align-items-center justify-content-center'>
        <JoinForm handleJoin={handleJoin} />
    </div>
  )
}

export default JoinRoom