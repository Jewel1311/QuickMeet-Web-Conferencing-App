import React, { useEffect, useRef, useState } from 'react';
import Chat from '../components/LiveChat'
import VideoFrame from '../components/VideoFrame';
import MeetControls from '../components/MeetControls';
import Loading from '../components/Loading';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { useNavigate } from 'react-router-dom'
import { client } from '../AgoraClient';


function MainRoom({ data }) {

  const navigate = useNavigate()

  const miniPlayerRef = useRef()

  const [showChat, setShowChat] = useState(false)

  const [loaded, setLoaded] = useState(false)

  const [audioTrackState, setAudioTrackState] = useState(false)

  const [videoTrackState, setVideoTrackState] = useState(false)

  const localtracks = useRef([]) // set local user audio and video

  const localuser = useRef(null)

  const toggleChat = () => {
    showChat ? setShowChat(false) : setShowChat(true)
  }

  const app_id = process.env.REACT_APP_ID;



  //to store the audio and video of users joining the channel
  let remoteUser = {
    remoteAudioTrack: null,
    remoteVideoTrack: null,
    UserId: null
  };



  useEffect(() => {
    async function JoinMeeting() {
      try {
        // it joins a channel and returns a userid (local user's userid )
        const UID = await client.join(app_id, "first", "007eJxTYGC43aSve+5lShhnmETdnfLly0y94hVseL5pfRPLmfs8pUKBwdwwzSDR3MQkNdko0cTYMsXSONXcwNgw0cQixSgtMcWyWzE5pSGQkeHrwxZGRgYIBPFZGdIyi4pLGBgA3+IeoQ==", null)

        localuser.current = UID

        //get the local users audio and video
        let tracks = await AgoraRTC.createMicrophoneAndCameraTracks()

        //join/publish the local user to the channel
        await client.publish([tracks[0], tracks[1]]);
        //localtracks[0] contain audio and localtracks[1] contain video
        createMiniPlayer(UID, tracks[0], tracks[1]);

        localtracks.current = [tracks[0], tracks[1]]

        setLoaded(true)

      } catch (error) {
        console.log(error)
      }

    }

    JoinMeeting() //join the local user

  }, [])
  //when a new user joined the channel
  client.on("user-published", async (user, mediaType) => {
    try {
      await client.subscribe(user, mediaType); //subscribe to the newly joined

      remoteUser.UserId = user.uid.toString();

      //if the joined users video is available
      if (mediaType === 'video') {
        remoteUser.remoteVideoTrack = user.videoTrack;
        remoteUser.remoteAudioTrack = user.audioTrack;

      }

      //if the joined user has only audio stream (joined user camera off)
      if (mediaType === 'audio') {
        remoteUser.remoteAudioTrack = user.audioTrack;
      }

      createMiniPlayer(remoteUser.UserId, remoteUser.remoteAudioTrack, remoteUser.remoteVideoTrack)
    } catch (error) {
      console.log(error)
    }

  });


  //when a remoter user leaves the meeting
  client.on("user-unpublished", function (user, mediaType) {
    let remotedoc = document.getElementById(`user-${user.uid}`)
    if (remotedoc) {
      remotedoc.remove();
    }
  });


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

    parentElement.id = `user-${uid}`;
    videoElement.id = uid;


    childElement.appendChild(videoElement)
    parentElement.appendChild(childElement)
    miniPlayerRef.current.appendChild(parentElement)


    if (videoTrack !== null) {
      videoTrack.play(`${uid}`);
      videoTrack.setMuted(true)
    }
    if (audioTrack !== null) {
      audioTrack.play()
      audioTrack.setMuted(true)
    }
  }

 //mic controls
  const micButton = async () => {
    if (audioTrackState) {
      await localtracks.current[0].setMuted(true) //mute the audio 
      setAudioTrackState(false)
    }
    else {
      await localtracks.current[0].setMuted(false) //unmute the audio
      setAudioTrackState(true)
    }
  }

  //camera controls
  const videoButton = async () => {
    if (videoTrackState) {
      await localtracks.current[1].setMuted(true) //mute the audio 
      setVideoTrackState(false)
    }
    else {
      await localtracks.current[1].setMuted(false) //unmute the audio
      setVideoTrackState(true)
    }
  }

  //close the call remove audio and video
  const closeCall = async () => {
    localtracks.current[0].stop();
    localtracks.current[1].stop();
    localtracks.current[0].close();
    localtracks.current[1].close();
    document.getElementById(`user-${localuser.current}`).remove();
    await client.leave();


    navigate("/")
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
            <MeetControls toggleChat={toggleChat} showChat={showChat} closeCall={closeCall} micButton={micButton} 
            audioState={audioTrackState} videoButton={videoButton} videoState={videoTrackState} />
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