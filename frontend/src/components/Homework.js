import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import API_BASE_URL from "../config";

export default function Homework({ index, homeworkData, view, handleRemoveHomework, setError, setSuccess }) {
    function formatTimeToEST(time) {
        time = time.split('T')[1]
        const utcTime = DateTime.fromISO(time, {zone: "utc"})
        const estTime = utcTime.setZone("America/New_York")
        return estTime.toFormat("hh:mma")
    }

    const [screenshotField, setScreenshotField] = useState(false)
    const [homeworkScreenshot, setHomeworkScreenshot] = useState(null)
    const [preview, setPreview] = useState(null)
    const [homeworkOpen, setHomeworkOpen] = useState(false)
    const [homeworkStatus, setHomeworkStatus] = useState(null)

    const handleOpenHomework = (open) => {
        setHomeworkOpen(open)
    }

    const handleScreenshotForm = (open) => {
        setScreenshotField(open)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setHomeworkScreenshot(file)
            const imgUrl = URL.createObjectURL(file)
            setPreview(imgUrl)
        }
    }

    const submitHomeworkScreenshot = async(id) => {
        if (!homeworkScreenshot) {
            return setError("Select a file first!")
        }

        
        const formData = new FormData()
        formData.append('file', homeworkScreenshot)
        console.log(id)
        formData.append('id', id)

        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`${API_BASE_URL}/upload-screenshot`, {
                method:'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            if (response.ok) {
                const result = await response.json()
                setSuccess(result.message)
                setScreenshotField(false)
            } else {
                const result = await response.json()
                setError(result.error)
            }

        } catch (error) {
            console.error("Upload failed:", error);
            setError("Upload failed. Try again!");
        }
    }

    useEffect(() => {
        const updateHomeworkStatus = () => {
            if (homeworkData.submission_url) {
                setHomeworkStatus('SUBMITTED')
            } else {
                setHomeworkStatus(homeworkData.status)
            }
        }

        updateHomeworkStatus()
        console.log(homeworkData)
    }, [homeworkData])

    return (
        <>
            {view === 'tutor' ? (
                <div key={index}>
                    <p>Title</p>
                    <h3>{homeworkData.title}</h3>
                    <p>Due: {formatTimeToEST(homeworkData.dueDate)} {homeworkData.dueDate.split('T')[0]}</p>
                    {homeworkData.status === 'SUBMITTED' ? <a target="_blank" rel="noopener noreferrer" href={homeworkData.submission_url}>Student submission</a> : 'Not submmited'}
                    <button onClick={() => handleRemoveHomework(homeworkData.id)}>Remove</button>
                </div>
            ) : (
                <>
                    <div className="homework-header">
                        <h3 onClick={() => handleOpenHomework(true ? homeworkOpen === false : false)} style={{cursor: 'pointer'}}>{homeworkData.title}</h3>
                        <p>{homeworkStatus}</p>  {/* make animation for submission later */}
                    </div>
                    {homeworkOpen && (
                        <div key={index}>
                            <p>Due: {formatTimeToEST(homeworkData.dueDate)} {homeworkData.dueDate.split('T')[0]}</p>
                            <p>Desc:</p>
                            <p>{homeworkData.desc}</p>
                            <button onClick={() => handleScreenshotForm(true)}>Submit screenshot</button>
                            {homeworkData.submission_url && <a href={homeworkData.submission_url}>Img link</a>}
                            {screenshotField && (
                                <>
                                    <p>Submit your screenshot here</p>
                                    <input type="file" onChange={handleFileChange} />
                                    <div>
                                        {/* change later in frontend */}
                                        {preview && <img src={preview} alt="Preview" style={{ width: 200, marginTop: 10 }} />} 
                                    </div>
                                    <button onClick={() => submitHomeworkScreenshot(homeworkData.id)}>Submit</button>
                                    <button onClick={() => handleScreenshotForm(false)}>Close</button>
                                </>
                            )}
                            <div>
                                {homeworkData.submission_url && (
                                    <img src={homeworkData.submission_url} alt="Preview" style={{ width: 200, marginTop: 10 }}/>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    )
}