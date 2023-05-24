import React, { useEffect, useRef, useState } from 'react';
import VideoFrame from '../components/VideoFrame';
import MeetControls from '../components/MeetControls';
import Loading from '../components/Loading';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { useNavigate } from 'react-router-dom'
import { client } from '../AgoraClient';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';


function MainRoom({ data, setErr }) {


  const navigate = useNavigate()

  const miniPlayerRef = useRef(null)

  const [loaded, setLoaded] = useState(false)

  const [bigFrame, setBigFrame] = useState(false)

  const [audioTrackState, setAudioTrackState] = useState(false)

  const [videoTrackState, setVideoTrackState] = useState(false)

  const [screenshare, setScreenShare] = useState(false)

  const [showCamera, setShowCamera] = useState(true)

  const [shareState, setshareState] = useState(false)

  const [stream, setStream] = useState()

  const closeid = useRef(null)

  const localtracks = useRef([]) // set local user audio and video

  const localuser = useRef(null)

  const screenTrack = useRef(null)

  const remoteStreams = {}



  const app_id = process.env.REACT_APP_ID;



  //to store the audio and video of users joining the channel
  let remoteUser = {
    remoteAudioTrack: null,
    remoteVideoTrack: null,
    UserId: null
  };



  useEffect(() => {

    const retrieveMeeting = async () => {
      try {
        const documentRef = doc(db, "meetings", data.channelName);

        // Retrieve the document
        const documentSnapshot = await getDoc(documentRef);

        if (documentSnapshot.exists()) {
          // Document exists, extract the data
          const meetingData = documentSnapshot.data();

          JoinMeeting(meetingData.token);
        }
        else{
          setErr("Invalid Credentials")
          navigate("/")
        }
      } catch (error) {
        setErr("Invalid Credentials")
        navigate("/")
      }
    };

    async function JoinMeeting(token) {
      try {
        // it joins a channel and returns a userid (local user's userid )
        const UID = await client.join(app_id, data.channelName, token, null)

        localuser.current = UID

        //get the local users audio and video

        let tracks = await AgoraRTC.createMicrophoneAndCameraTracks()

        await updateMeetingUsers(UID)

        //join/publish the local user to the channel
        await client.publish([tracks[0], tracks[1]]);
        //localtracks[0] contain audio and localtracks[1] contain video 


        await createMiniPlayer(UID, tracks[0], tracks[1]);

        localtracks.current = [tracks[0], tracks[1]]

        if (!remoteStreams[UID]) {
          remoteStreams[UID] = tracks[1];
        }


        setLoaded(true)

      } catch (error) {
        setErr("Unable to join");
        navigate("/")

      }

    }

    retrieveMeeting()
  }, [])


  //update usernames when with userid in firebase
  const updateMeetingUsers = async (uid) => {
    try {
      const documentRef = doc(db, "meetings", data.channelName);

      // Retrieve the document data
      const documentSnapshot = await getDoc(documentRef);
      const documentData = documentSnapshot.data();

      // Update the users data within the document
      const updatedUsers = {
        ...documentData.users,
      };
      updatedUsers[uid] = data.displayName

      // Save the updated users data back to Firestore
      await updateDoc(documentRef, { users: updatedUsers });

    } catch (error) {
      console.error("Error updating meeting users:", error);
    }
  }


  const getUserName = async (uid) => {
    const documentRef = doc(db, "meetings", data.channelName);
    // Retrieve the document data
    const documentSnapshot = await getDoc(documentRef);
    const documentData = documentSnapshot.data();
    const usersdata = documentData['users']

    return usersdata[uid]

  }

  //when a new user joined the user published a video or audio
  client.on("user-published", async (user, mediaType) => {
    try {

      await client.subscribe(user, mediaType); //subscribe to the newly published audio/video

      if (!remoteStreams[user.uid]) {
        remoteStreams[user.uid] = user.videoTrack;
      }

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
      await createMiniPlayer(remoteUser.UserId, remoteUser.remoteAudioTrack, remoteUser.remoteVideoTrack)
    } catch (error) {
      console.log(error)
    }

  });

  client.on("user-joined", (user) => {

    createContainer(user.uid);
  })

  client.on("user-left", (user) => {
    let remotedoc = document.getElementById(`user-${user.uid}`)
    if (remotedoc) {
      remotedoc.remove();
    }
    delete remoteStreams[user.uid]
  })



  const createContainer = async (uid) => {

    const userName = await getUserName(uid)

    if (!document.getElementById(`user-${uid}`)) {
      const parentElement = document.createElement('div');
      const childElement = document.createElement('div');
      const videoElement = document.createElement('video');
      const videoText = document.createElement('div');

      parentElement.className = 'col-lg-3 col-md-4 col-6';
      childElement.className = 'my-3 video-frame rounded';
      videoElement.className = 'mini-player rounded dark-cont';
      videoText.className = 'text-style'

      parentElement.id = `user-${uid}`;
      childElement.id = `child-${uid}`;
      videoElement.id = uid;
      videoText.textContent = userName

      parentElement.addEventListener('click', () => {
        getStream(uid);
      });

      childElement.appendChild(videoElement);
      childElement.appendChild(videoText)
      parentElement.appendChild(childElement);
      miniPlayerRef.current.appendChild(parentElement);
    }
  }

  //create a mini player and play audio and video on screen
  const createMiniPlayer = async(uid, audioTrack, videoTrack) => {

    await createContainer(uid)

    if (videoTrack !== null) {
      videoTrack.play(`${uid}`)
      videoTrack.setMuted(true)
    }

    if (audioTrack !== null) {
      audioTrack.play(`${uid}`);
      audioTrack.setMuted(true)
    }

  };


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
      await localtracks.current[1].setMuted(true) //mute the video
      setVideoTrackState(false)
    }
    else {
      await localtracks.current[1].setMuted(false) //unmute the video
      setVideoTrackState(true)
    }
  }

  const getStream = (userid) => {
    if (closeid.current === null) {
      closeid.current = userid //set to call when closing big screen
      const selectedElement = document.getElementById(userid)
      if (remoteStreams[userid]) {
        setStream(remoteStreams[userid])
        setBigFrame(true);
        selectedElement.classList.add("frame-selected")
      }
      else {
        setStream(null)
        setBigFrame(true);
        selectedElement.classList.add("frame-selected")
      }
    }
  }

  const closeBigFrame = () => {
    const videoElement = document.getElementById(`${closeid.current}`)
    if (stream) {
      stream.play(videoElement)
    }
    closeid.current = null
    setStream(null)
    setBigFrame(false);
    videoElement.classList.remove("frame-selected")
  }

  const shareScreen = async () => {
    try {
      if (!screenshare) {
        const ele = document.getElementById(`user-${localuser.current}`)
        ele.remove()

        createContainer(localuser.current)
        const screen = await AgoraRTC.createScreenVideoTrack();

        screen.play(`${localuser.current}`)

        screenTrack.current = screen

        await client.unpublish([localtracks.current[1]])
        await client.publish([screen])

        remoteStreams[localuser.current] = screen
        setScreenShare(true)
        setShowCamera(false)
        setshareState(true)
      }
      else {
        const ele = document.getElementById(`user-${localuser.current}`)
        ele.remove()

        createContainer(localuser.current)
        localtracks.current[1].play(`${localuser.current}`)

        await client.unpublish([screenTrack.current])
        screenTrack.current.stop()
        screenTrack.current.close()

        await client.publish([localtracks.current[1]])

        screenTrack.current = null

        remoteStreams[localuser.current] = localtracks.current[1]
        setScreenShare(false)
        setShowCamera(true)
        setshareState(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  //close the call remove audio and video
  const closeCall = async () => {
    localtracks.current[0].stop();
    localtracks.current[1].stop();
    localtracks.current[0].close();
    localtracks.current[1].close();
    if (screenTrack.current) {
      screenTrack.current.stop()
      screenTrack.current.close()
    }
    document.getElementById(`user-${localuser.current}`).remove();
    await client.leave();

    setErr(null)
    navigate("/")
    window.location.reload();
  }



  return (
    <>
      {loaded ? "" : <div className='vh-100 d-flex justify-content-center align-items-center'><Loading /></div>}
      <div className='maincontent '>
        <div className="row m-1">
          <div className='col-lg-12'>
            {loaded && bigFrame &&
              <>
                <VideoFrame stream={stream} closeBigFrame={closeBigFrame} />
              </>
            }
            <div className="row mx-2" ref={miniPlayerRef}>

            </div>


          </div>
          {loaded &&
            <MeetControls closeCall={closeCall} micButton={micButton}
              audioState={audioTrackState} videoButton={videoButton} videoState={videoTrackState} shareScreen={shareScreen} showCamera={showCamera} shareState={shareState} />
          }
        </div>
      </div>
    </>
  )
}

export default MainRoom