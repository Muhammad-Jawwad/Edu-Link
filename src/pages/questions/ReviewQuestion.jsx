import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import MyTimer from "../../components/timer/MyTimer";
import "./testQuestion.scss";
import { serverURL } from "../../temp";

const ReviewQuestion = () => {
    const [token] = useState(localStorage.getItem("token"));
    // Extracting categoryId using regular expressions
    const location = useLocation();
    const questionId = location.pathname.match(/\/quiz\/reviewQuestion\/(\d+)/)?.[1];
    const time = localStorage.getItem("timer");
    const [adminData] = useState(JSON.parse(localStorage.getItem("adminData")));
    const [quizId] = useState(localStorage.getItem("quizId"));
    const [attemptCode] = useState(localStorage.getItem("attemptCode"));;
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [apiQuestions, setApiQuestions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [progressValue, setProgressValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isOptionSelected, setIsOptionSelected] = useState(false);

    const redirectToLogin = () => {
        console.log("Here in redirect login")
        window.location.href = "/notFound";
    };

    const fetchQuestions = async () => {
        try {
            const config = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            };
            const response = await axios.post(`${serverURL}/api/users/getreviewquestion`, {
                user_id: adminData.id,
                quiz_id: quizId,
                attemptCode,
                question_id: questionId
            },
                config,
            );
            setProgressValue(response.data.progressValue[0].progress)
            setApiQuestions(response.data.data);
        } catch (error) {
            console.error("Error fetching questions:", error);
            if (error.response && (error.response.status === 401 || error.response.status === 498)) {
                console.error("Unauthorized: Please log in");
                window.location.href = "/notFound";
            }
            window.location.href = "/notFound";
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await fetchQuestions();
                setLoading(false);
            } catch (error) {
                setLoading(false);
                redirectToLogin();
            }
        };
        if (token) {
            fetchData();
        } else {
            redirectToLogin();
        }
    }, [token]);

    const submitUserAnswer = async (userAnswer) => {
        const { quiz_id, id } = apiQuestions;
        const user_id = adminData.id;
        const config = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };
        try {
            const response = await axios.post(`${serverURL}/api/users/reviewanswer`, {
                user_id,
                quiz_id,
                question_id: id,
                entered_option: userAnswer,
                time: localStorage.getItem("timer"),
                attemptCode,
            },
                config,
            );
            if (response.data.status === false && response.data.code === 400) {
                localStorage.setItem("score", response.data.score);
                window.location.href = "/quiz/endQuiz";
            } else {
                console.log("from reviewanswer", response.data.data.question_id);
                const Response = await axios.post(`${serverURL}/api/users/getreviewquestion`, {
                    user_id: adminData.id,
                    quiz_id: quizId,
                    attemptCode,
                    question_id: response.data.data.question_id
                },
                    config,
                );
                setSelectedOption(null);
                setProgressValue(Response.data.progressValue[0].progress);
                setApiQuestions(Response.data.data);
            }
        } catch (error) {
            console.error("Error submitting user answer:", error);
            if (error.response && (error.response.status === 401 || error.response.status === 498)) {
                console.error("Unauthorized: Please log in");
                window.location.href = "/notFound";
            }
            window.location.href = "/notFound";
        }
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        setIsOptionSelected(true);
    };

    const handleNext = () => {
        if (isOptionSelected) {
            submitUserAnswer(selectedOption);
            setCurrentQuestion((prevQuestion) => prevQuestion + 1);
            setIsOptionSelected(false);
        }
    };

    const options = useMemo(
        () => [
            apiQuestions.option_1,
            apiQuestions.option_2,
            apiQuestions.option_3,
            apiQuestions.option_4,
        ],
        [apiQuestions]
    );

    return (
        <>
            {!token && redirectToLogin()}
            {token && (
                <div>
                    <Navbar />
                    <div className="test-question-page">
                        <div className="card">
                            <div className="timer">
                                <MyTimer duration={time} />
                            </div>
                            <div className="progress-div">
                                <progress
                                    className="progress"
                                    value={progressValue}
                                    max={100}
                                    style={{
                                        background: "white",
                                    }}
                                />
                            </div>
                            {loading ? (
                                <h1 style={{ textAlign: "center", paddingTop: "20%" }}>loading...</h1>
                            ) : (
                                <div>
                                    <h2 className="question">{apiQuestions.question}</h2>
                                    <div>
                                        {options.map((option, index) => (
                                            <div key={index} className="option">
                                                <input
                                                    type="radio"
                                                    id={`option-${index + 1}`}
                                                    name="option"
                                                    value={option}
                                                    checked={selectedOption === option}
                                                    onChange={handleOptionChange}
                                                />
                                                <label htmlFor={`option-${index + 1}`}>{option}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="buttons">
                                {/* <button
                                    className="previousButton"
                                    onClick={handlePrevious}
                                    disabled={currentQuestion === 0}
                                >
                                    Previous
                                </button> */}
                                <button
                                    className="nextButton"
                                    onClick={handleNext}
                                    disabled={!isOptionSelected || currentQuestion === apiQuestions.length - 1}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ReviewQuestion;