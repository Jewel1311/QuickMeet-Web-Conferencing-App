import React, { useRef, useState } from 'react'



function CreateMeet() {

    const [box, setBox] = useState(false)
    const [meetid, setMeetId] = useState(null)
    const snippetRef = useRef(null)

    function createMeeting() {
        //produce a random meeting id
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let meetingid = ""

        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            meetingid = meetingid + chars[randomIndex]
        }   

        setBox(true)
        setMeetId(meetingid)

    }

    const handleCopy = () => {
        snippetRef.current.select()
        document.execCommand('copy');
    }



    return (
        <>
            <button className='button2  my-2' style={{ width: "100%" }} onClick={createMeeting}><i className="fa-solid fa-plus"></i> Create Meeting</button>
            {box &&
                <div>
                    <label className='form-label'>Generated meeting id</label>
                    <div className=" d-flex">
                        <input type="text" className='txtbg text-white meetidbox' ref={snippetRef} defaultValue={meetid} />
                        <button onClick={handleCopy} className='cpybtn'><i className="fa-solid fa-copy"></i></button>
                    </div>
                </div>
            }
        </>
    )
}

export default CreateMeet