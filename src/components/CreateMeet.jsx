import React, { useRef, useState } from 'react'
import { doc, setDoc } from "firebase/firestore";
import { db } from '../firebase';
import Loading from './Loading';



function CreateMeet() {

    const [box, setBox] = useState(false)
    const [creating, setCreating] = useState(false)

    const meetid = useRef(null)
    const agoraToken = useRef(null)
    const snippetRef = useRef(null)

    const url = process.env.REACT_APP_URL

    function createMeeting() {
        setCreating(true)
        //produce a random meeting id
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let meetingid = ""

        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            meetingid = meetingid + chars[randomIndex]
        }

        meetid.current = meetingid

        generateRtcToken()

    }

    const handleCopy = () => {
        snippetRef.current.select()
        document.execCommand('copy');
    }

    const generateRtcToken = async () => {
        try {
            const response = await fetch(`${url}/access-token?channelName=${meetid.current}`);
            const data = await response.json();
            agoraToken.current = data.token;

            storeMeetDetails()

        } catch (err) {
            console.log(err)
        }
    }

    const storeMeetDetails = async () => {
        await setDoc(doc(db, "meetings", meetid.current), {
            token: agoraToken.current,
            users: {}
        });
        setBox(true)
        setCreating(false)
        
    }   
     


    return (
        <>
            <button className='button2  my-2' style={{ width: "100%" }} onClick={createMeeting}><i className="fa-solid fa-plus"></i> Create Meeting</button>
            {creating &&
                <div className="d-flex justify-content-center align-items-center">
                    <Loading />
                </div>
            }
            {box &&
                <div>
                    <label className='form-label'>Generated meeting id</label>
                    <div className=" d-flex">
                        <input type="text" className='txtbg text-white meetidbox' ref={snippetRef} defaultValue={meetid.current} />
                        <button onClick={handleCopy} className='cpybtn'><i className="fa-solid fa-copy"></i></button>
                    </div>
                </div>
            }
        </>
    )
}

export default CreateMeet