import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./testHome.scss";
import TestWidget from "../../components/widget/TestWidget";
import BeatLoader from "react-spinners/BeatLoader";
import { serverURL } from "../../temp";
import { useLocation } from 'react-router-dom';

const TestHome = () => {
    const [token] = useState(localStorage.getItem("token"));
    const [userId] = useState(localStorage.getItem("userId"));
    const [quizData, setQuizData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const categoryId = queryParams.get("id");
    console.log("id", categoryId);

    const redirectToLogin = () => {
        window.location.href = "/notFound";
    };

    const fetchQuizData = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(
                `${serverURL}/api/users/quizbycategoryId/${categoryId}`,
                {
                    user_id: userId,
                },
                config
            );
            setQuizData(response.data.data);
        } catch (error) {
            console.error("Error fetching quiz data:", error);
            // Handle errors, e.g., unauthorized or redirect to login
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("Clear local storage when the home page component mounts");
        localStorage.removeItem("score");
        localStorage.removeItem("attemptCode");
        localStorage.removeItem("quizId"); // Clear local storage when the home page component mounts
    }, []);
    
    useEffect(() => {
        if (token && categoryId) {
            fetchQuizData();
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, categoryId]);

    return (
        <>
            {!token && redirectToLogin()}
            {token && (
                <div className="testHome">
                    <Sidebar />
                    <div className="homeContainer">
                        <Navbar />
                        <div>
                            {categoryId ? (
                                loading ? (
                                    <div className="beatLoader">
                                        <BeatLoader color="#5a38d4" />
                                    </div>
                                ) : (
                                    <>
                                        {quizData.length > 0 ? (
                                            <div className="widgets">
                                                {quizData.map((quiz, index) => (
                                                    <div className="widgetWrapper" key={index}>
                                                        <TestWidget type={quiz} />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="noDataFoundMessage">
                                                No Quiz Found.
                                            </div>
                                        )}
                                    </>
                                )
                            ) : (
                                <div className="categoryNotSelectedMessage">
                                    Select the Category first.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TestHome;
