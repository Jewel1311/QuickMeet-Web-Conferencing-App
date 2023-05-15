import React, { useRef, useState } from 'react';
import Chat from '../components/LiveChat'
import VideoFrame from '../components/VideoFrame';
import MeetControls from '../components/MeetControls';
import Loading from '../components/Loading';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { useNavigate } from 'react-router-dom'


function MainRoom({ data }) {

  const navigate = useNavigate()

  const miniPlayerRef = useRef()

  const [showChat, setShowChat] = useState(false)

  const [loaded, setLoaded] = useState(true)

  const [localtracks, setLocalTracks] = useState([]) // set local user audio and video

  const toggleChat = () => {
    showChat ? setShowChat(false) : setShowChat(true)
  }


  const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });


  //to store the audio and video of users joining the channel
  let remoteUsers = {
    reomteAudioTrack: null,
    remoteVideoTrack: null,
    UserId: null
  };


  useState(() => {
    async function JoinMeeting() {
      try {

        // it joins a channel and returns a userid (local user's userid )
        const UID = await client.join("22c57500f7bc45b2b37d2abfb059b4a2", "new", "007eJxTYLiqeTv/Y+z7qE2uNq2zNBub3Ne6f+dZ1xtsE/Nvgs/FzdMUGIyMkk3NTQ0M0syTkk1Mk4ySjM1TjBKT0pIMTC2TTBKNNigmpTQEMjJsZzZgYWSAQBCfmSEvtZyBAQBwOx9L", null)

        //get the local users audio and video
        let tracks = await AgoraRTC.createMicrophoneAndCameraTracks()

        //join/publish the local user to the channel
        await client.publish([tracks[0], tracks[1]]);
        //localtracks[0] contain audio and localtracks[1] contain video
        createMiniPlayer(UID, tracks[0], tracks[1]);

        setLocalTracks(tracks)
        setLoaded(true)

      } catch (error) {
        console.log(error)
      }

    }

    JoinMeeting()
  }, [])


  //when a new user joined the channel
  client.on("user-published", async (user, mediaType) => {
    try {
      await client.subscribe(user, mediaType); //subscribe to the newly joined

      remoteUsers.UserId = user.uid.toString();

      //if the joined users video is available
      if (mediaType === 'video') {
        remoteUsers.remoteVideoTrack = user.videoTrack;
        remoteUsers.reomteAudioTrack = user.audioTrack;

      }

      //if the joined user has only audio stream (joined user camera off)
      if (mediaType === 'audio') {
        remoteUsers.reomteAudioTrack = user.audioTrack;
      }

      createMiniPlayer(remoteUsers.UserId, remoteUsers.remoteAudioTrack, remoteUsers.remoteVideoTrack)
    } catch (error) {
      console.log(error)
    }

  })

  //create a mini player and play audio and video on screen
  const createMiniPlayer = (uid, audioTrack, videoTrack) => {

    const existingContainer = document.getElementById(uid);
    if (existingContainer) {
      // Container already exists, so just update the video track
      if (videoTrack !== null) {
        videoTrack.play(`${uid}`);
      }
      return;
    }
    const parentElement = document.createElement('div')
    const childElement = document.createElement('div')
    const videoElement = document.createElement('video')

    parentElement.className = "col-lg-3 col-md-4 col-6"
    childElement.className = "bg-secondary my-3 video-frame rounded"
    videoElement.className = 'mini-player rounded'

    videoElement.id = uid;

    childElement.appendChild(videoElement)
    parentElement.appendChild(childElement)
    miniPlayerRef.current.appendChild(parentElement)


    if (videoTrack !== null) {
      videoTrack.play(`${uid}`);
    }
    if (audioTrack !== null) {
      // audioTrack.play()
    }
  }




  //close the call remove audio and video
  let closeCall = async () => {
    localtracks[0].stop();
    localtracks[1].stop();
    localtracks[0].close();
    localtracks[1].close();
    await client.leave();
  
    // navigate("/")
  }



  return (
    <>
      {loaded ? "" : <div className='vh-100 d-flex justify-content-center align-items-center'><Loading /></div>}
      <div className='maincontent '>
        <div className="row m-1">
          <div className='col-lg-9'>
            {loaded &&
              <VideoFrame />
            }
            <div className="row mx-2" ref={miniPlayerRef}>

            </div>


          </div>
          {loaded &&
            <div className='col-lg-3 col-md-6 col-12 d-lg-block d-none'>
              <Chat />
            </div>
          }
          {loaded &&
            <MeetControls toggleChat={toggleChat} showChat={showChat} closeCall={closeCall} />
          }
        </div>
      </div>


      {showChat && loaded &&
        <div className='col-lg-3 col-md-6 col-12 d-lg-none align-chat'>
          <Chat />
        </div>
      }
    </>
  )
}

export default MainRoom