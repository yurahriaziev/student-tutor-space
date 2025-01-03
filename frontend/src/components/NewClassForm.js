import React, { useState } from "react";

export default function NewClassForm({ handleNewClassClick, setError, createNewMeeting, students }) {
    const [title, setTitle] = useState('')
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [assignedStudent, setAssignedStudent] = useState("")

    const handleStartTimeChange = (e) => {
        setStartTime(e.target.value)
    }
    const handleEndTimeChange = (e) => {
        setEndTime(e.target.value)
    }

    const handleAssignedStudentChange = (e) => {
        setAssignedStudent(e.target.value)
    }

    const formatTimeToISO = (time) => {
        const date = new Date()
        const [hours, minutes] = time.split(":")
        date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)
        return date.toISOString()
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if (!startTime || !endTime) {
            setError('Select both, start and end times.')
            return
        }

        if (startTime >= endTime) {
            setError('Start and end must differ')
            return
        }

        try {
            const fStart = formatTimeToISO(startTime)
            const fEnd = formatTimeToISO(endTime)

            createNewMeeting(title, fStart, fEnd, assignedStudent)
        } catch (err) {
            setError("An error occurred while creating the meeting.");
        }
    }

    const startTimeOptions = []
    for (let hour = 15; hour <= 17; hour++) {
        for (let min = 0; min < 60; min+=30) {
            if (hour === 17 && min > 30) break
            const formatedTime = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`
            startTimeOptions.push(formatedTime)
        }
    }
    const endTimeOptions = []
    for (let hour = 16; hour <= 18; hour++) {
        for (let min = 0; min < 60; min+=30) {
            if (hour === 17 && min > 30) break
            const formatedTime = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`
            endTimeOptions.push(formatedTime)
        }
    }

    return (
        <div className="class-form-cont">
            <button onClick={() => handleNewClassClick(false)}>Close</button>
            <div className="class-form-title">
                Create a new class.
            </div>
            <div className="class-form">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Class Title"
                        value={title}
                        required={true}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div>
                        <label htmlFor="start-time-picker">Start Time:</label>
                        <select
                            id="start-time-picker"
                            value={startTime}
                            onChange={handleStartTimeChange}
                        >
                            <option value="">--Select Start Time--</option>
                            {startTimeOptions.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="start-time-picker">End Time:</label>
                        <select
                            id="end-time-picker"
                            value={endTime}
                            onChange={handleEndTimeChange}
                        >
                            <option value="">--Select End Time--</option>
                            {endTimeOptions.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="assign-student-picker">Assign Student:</label>
                        <select
                            id="assign-student-picker"
                            value={assignedStudent}
                            onChange={handleAssignedStudentChange}
                        >
                            <option value="">--Select Student--</option>
                            {students.map((student, index) => (
                                <option key={index} value={student.id}>
                                    {student.first + ' ' + student.last}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit">Create Class</button>
                </form>
            </div>
        </div>
    )
}