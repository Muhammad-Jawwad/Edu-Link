import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './single.scss';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import { Link } from "react-router-dom";
import { serverURL } from '../../temp';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';

const QuizSingle = () => {
    // Extracting quizId using regular expressions
    const location = useLocation();
    const quizId = location.pathname.match(/\/quizList\/(\d+)/)?.[1];
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const qValue = queryParams.get("q");

    console.log("qValue", qValue);

    const [quiz, setQuiz] = useState(null);
    let [token] = useState(localStorage.getItem("token"));

    const redirectToLogin = () => {
        window.location.href = "/notFound";
    };

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`${serverURL}/api/admin/quizbyid/${quizId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 498) {
                        console.error("Unauthorized: Please log in");
                        window.location.href = "/notFound";
                    } else {
                        throw new Error('Failed to fetch quiz');
                    }
                }

                const data = await response.json();
                console.log(data);

                setQuiz(data);
                localStorage.setItem("quizData", JSON.stringify(data));
            } catch (error) {
                console.error(error);
                if (error.response && (error.response.status === 401 || error.response.status === 498)) {
                    console.error("Unauthorized: Please log in");
                    window.location.href = "/notFound";
                }
            }
        };

        if (quizId) {
            fetchQuiz();
        }
    }, [quizId]);

    return (
        <>
            {!token && redirectToLogin()}
            {token && (
                <div className="single">
                    <Sidebar />
                    <div className="singleContainer">
                        <Navbar />
                        <div className="top">
                            <div className="left">
                                <div className="editButton">
                                    <Link to={`/quizList/update/${quizId}?q=${qValue}`} className=" link">
                                        <CreateOutlinedIcon className="icon" />
                                    </Link>
                                </div>
                                <h1 className="title">Quiz Information</h1>
                                <div className="item">
                                    <img src={
                                        quiz?.data[0].picture
                                    }
                                        alt=""
                                        className="itemImg"
                                    />
                                    <div className="details">
                                        <h1 className="itemTitle">{quiz?.data[0].quiz_name}</h1>
                                        <div className="detailItem">
                                            <span className="itemKey">Id: </span>
                                            <span className="itemValue">{quiz?.data[0].id}</span>
                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Quiz Number: </span>
                                            <span className="itemValue">{quiz?.data[0].quiz_no}</span>
                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Category: </span>
                                            <span className="itemValue">{quiz?.data[0].category_name}</span>
                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Number of Questions: </span>
                                            <span className="itemValue">{quiz?.data[0].no_of_questions}</span>
                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Description: </span>
                                            <span className="itemValue">{quiz?.data[0].description}</span>
                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Duration: </span>
                                            <span className="itemValue">{quiz?.data[0].duration}</span>
                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Number of Questions: </span>
                                            <span className="itemValue">{quiz?.data[0].no_of_questions}</span>
                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Status: </span>
                                            <span className="itemValue">{quiz?.data[0].status}</span>
                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Number of Attempts: </span>
                                            <span className="itemValue">{quiz?.data[0].no_of_attempts}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="right">
                    <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
                </div> */}
                        </div>
                        {/* <div className="bottom">
                <h1 className="title">Last Transactions</h1>
                <List />
                </div> */}
                    </div >
                </div>
                )
            }
        </>
    );
};

export default QuizSingle;