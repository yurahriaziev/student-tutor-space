import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login({ role }) {
    const [userCode, setUserCode] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (location.state && location.state.error) {
            setError(location.state.error)
        }
    }, [location.state])

    const handleInput = (e) => {
        const input = e.target.value.toUpperCase()
        setUserCode(input)
    }

    useEffect(() => {
        if (error) {
            console.log(error)
        }
    }, [error])

    const handleLogin = async(e) => {
        setError('')
        e.preventDefault()
        console.log('login btn clicked', userCode) // LOG

        try {
            const response = await fetch("http://127.0.0.1:5000/process-login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({data: userCode.toUpperCase()})
            })

            if (response.ok) {
                const result = await response.json();
                console.log(result.message);    // LOG
                console.log(result.role);       // LOG
                console.log(result.token);      // LOG
                setError('')

                localStorage.setItem("role", result.role)
                localStorage.setItem("token", result.token)
                const tokenExp = Date.now() + 60 * 60 * 1000
                localStorage.setItem("token_expiry", tokenExp)

                if (result.role === 'admin') {
                    navigate('/admin-dash')
                } else if (result.role === 'tutor') {
                    console.log(result.googleConnected)
                    navigate(`/tutor-dash/${result.userId}/${result.googleConnected}`)
                } else if (result.role === 'student') {
                    navigate(`/student-dash/${result.userId}`)
                }
            } else {
                const result = await response.json();
                setError(result.message)
            }
        } catch (error) {
            console.log(error.message)  // LOG
            setError('Login failed')
        }
    }

    const changeLogin = (role) => {
        navigate(`/login-${role}`)
    }

    return (
        <div className="login-cont">
            {error && (
                <div style={{ fontWeight: 'bold', backgroundColor: 'red', color: 'white', padding: '10px', marginBottom: '10px' }}>
                    {error}
                </div>
            )}
            {role === 'student' ? (
                <div>
                    <h2>Student Login</h2>
                    <input 
                        type="text" 
                        placeholder="Enter Code" 
                        maxLength={4} 
                        className="code-input" 
                        value={userCode} 
                        onChange={handleInput}
                    />
                    <button onClick={handleLogin}>Login</button>
                </div>
            ) : (
                <div>
                    <h2>Tutor Login</h2>
                    <button>Google Sign In</button>
                </div>
            )}
            {role === 'student' ? (
                <button onClick={() => changeLogin('tutor')}>Tutor? Login here</button>
            ) : (
                <button onClick={() => changeLogin('student')}>Student? Login here</button>
            )}
        </div>
    )
}