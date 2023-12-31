import React, { useState } from 'react';
import { useTimer } from 'react-timer-hook';   
import axios from "axios"; 
import $ from 'jquery';
import { serverURL } from '../../temp';

const MyTimer = ({ duration }) => {
    const getExpiryTimestamp = (duration) => {
        if (typeof duration !== 'string') {
            console.error('Invalid duration:', duration);
            return null;
        }

        const [minutes, seconds] = duration.split(':').map(Number);

        if (isNaN(seconds) || isNaN(minutes)) {
            console.error('Invalid duration:', duration);
            return null;
        }

        const now = new Date();
        const expiry = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + minutes, now.getSeconds() + seconds);

        return expiry.getTime();
    };

    const handleQuizEnd = async () => {
        console.log("End quiz api...");
        const adminData = JSON.parse(localStorage.getItem("adminData"));
        const quiz_id = parseInt(localStorage.getItem("quizId"));
        const attemptCode = localStorage.getItem("attemptCode");
        const token = localStorage.getItem("token");
        const user_id = adminData.id

        console.log(quiz_id);
        console.log(attemptCode);
        console.log(user_id);

        const formData = {
            user_id,
            quiz_id,
            time: "00:00",
            attemptCode
        };
        const config = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };
        console.log("formData",formData);
        console.log("config",config);
        const response = await axios.post(`${serverURL}/api/users/endquiz`, formData, config);
        const score = response.data.score;
        console.log(score);
        localStorage.setItem("score", score);
        window.location.href = "/quiz/endQuiz";
    };

    const {
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({ expiryTimestamp: getExpiryTimestamp(duration), onExpire: handleQuizEnd });

    if (duration === null) {
        // Handle the case where the duration is invalid
        return (
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '35px', color: 'red' }}>Invalid duration</div>
            </div>
        );
    }

    return (

        <div>
        {(() => {
            // Set a value in localStorage
                localStorage.setItem('timer', minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0'));
        })()}

        

        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '35px' }}>
                Time Remaining: <div><span id="timeid" >{minutes.toString().padStart(2, '0')}</span>:<span id="secid">{seconds.toString().padStart(2, '0')}</span></div>
            </div>
         
            {/* Rest of the component */}
        </div>

        </div>
    );
};

export default MyTimer;
