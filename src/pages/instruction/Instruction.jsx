import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import "./instruction.scss";
import { serverURL } from "../../temp";

const Instruction = () => {
    const [token] = useState(localStorage.getItem("token"));
    const [instruction, setInstruction] = useState("");
    const [quizId] = useState(localStorage.getItem("quizId"));
    const [loading, setLoading] = useState(true);

    const redirectToLogin = () => {
        window.location.href = "/notFound";
    };

    const timeDuration = (time) => {
        const durationInMinutes = time;

        // Convert duration to milliseconds
        const durationInMilliseconds = durationInMinutes * 60000;

        // Create a new Date object with the duration in milliseconds
        const duration = new Date(durationInMilliseconds);

        // Extract minutes and seconds from the duration
        const seconds = duration.getSeconds();
        const minutes = duration.getMinutes();

        // Format the minutes and seconds into MM:SS format
        const formattedTime = `${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        return formattedTime;
    };

    const fetchQuizData = async () => {
        try {
            const response = await axios.get(`${serverURL}/api/users/quizbyid/${quizId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const formatedDuration = timeDuration(response.data.data[0].duration);
            console.log("formatedDuration", formatedDuration);

            localStorage.setItem("duration", formatedDuration);

            setInstruction(response.data.data[0].description);
        } catch (error) {
            console.error("Error fetching quiz data:", error);
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
                await fetchQuizData();
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                setLoading(false); // Set loading to false in case of error
                redirectToLogin();
            }
        };

        if (token) {
            fetchData(); // Fetch data when token is available
        } else {
            redirectToLogin();
        }
    }, [token]);

    const handleBeginTest = () => {
        // Handle the action when the "Begin Test" button is clicked
        window.location.href = "/quiz/quizQuestion";
    };

    return (
        <>
            {!token && redirectToLogin()}
            {token && (
                <div className="instruction">
                    <div className="homeContainer">
                        <Navbar />
                        <div className="content">
                            {loading ? (
                                <h1 style={{ textAlign: "center", paddingTop: "20%" }}>
                                    loading...
                                </h1>
                            ) : (
                                <div className="card">
                                    <h2 className="heading">INSTRUCTIONS</h2>

                                    <p className="description">{instruction}</p>
                                    <button className="beginButton" onClick={handleBeginTest}>
                                        Begin Test
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Instruction;
