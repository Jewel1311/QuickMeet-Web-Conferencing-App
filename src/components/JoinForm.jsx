import React from 'react'
import CreateMeet from './CreateMeet';


function JoinForm({handleJoin, error}) {


  const sendtoJoinRoom = (e) => {
    e.preventDefault();
    const displayName = e.target[0].value
    const channelName = e.target[1].value
  
    handleJoin({"displayName" : displayName, "channelName" : channelName})
  }

  


  return (
      <div className='px-4 py-4 custom-form col-xl-3 col-md-6 col-11 text-white rounded shadow'>
        <h3 className='text-center mb-4'><i className="fa-solid fa-q fs-1 px-1 logo"> </i> Join a Meeting</h3>
        {error !==null ? <div className='text-danger fw-bold text-center mb-2'>{error}</div> :""}

        <form onSubmit={sendtoJoinRoom}>
          <label htmlFor='display-name' className='form-label'>Display Name</label>
          <input className='form-control txtbg text-white' type="text" name="" id="display-name" placeholder='Your name' required />
          <label htmlFor='room' className='form-label mt-2'>Meeting id</label>
          <input className='form-control txtbg text-white' type="text" name="" id="room" required />
          <input className="button1 w-100 my-3" type="submit" value="Join" />
        </form>
        <CreateMeet />
      </div>
  )
}

export default JoinForm