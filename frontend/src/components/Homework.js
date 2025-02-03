import React, { useState } from "react";
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
    const [downloadURL, setDownloadURL] = useState('')

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
                setDownloadURL(result.downloadUrl)
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
    return (
        <>
            {view === 'tutor' ? (
                <div key={index}>
                    <p>Title</p>
                    <h3>{homeworkData.title}</h3>
                    <p>Due: {formatTimeToEST(homeworkData.dueDate)} {homeworkData.dueDate.split('T')[0]}</p>
                    <button onClick={() => handleRemoveHomework(homeworkData.id)}>Remove</button>
                </div>
            ) : (
                <div key={index}>
                    <p>Title</p>
                    <h3>{homeworkData.title}</h3>
                    <p>Due: {formatTimeToEST(homeworkData.dueDate)} {homeworkData.dueDate.split('T')[0]}</p>
                    <p>Desc:</p>
                    <p>{homeworkData.desc}</p>
                    <button onClick={() => handleScreenshotForm(true)}>Submit screenshot</button>
                    {downloadURL && <a href={downloadURL}>Img link</a>}
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
    )
}