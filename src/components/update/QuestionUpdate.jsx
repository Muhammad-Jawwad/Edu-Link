import "./update.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
// import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { questionInputs } from "../../formSource";
import { serverURL } from "../../temp";
import axios from "axios";


const QuestionUpdate = ({ title }) => {

    // Extracting questionId using regular expressions
    const location = useLocation();
    const questionId = location.pathname.match(/\/question\/update\/(\d+)/)?.[1];
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const qValue = queryParams.get("q");
    let [token] = useState(localStorage.getItem("token"));

    // Initializing state
    const [inputValues, setInputValues] = useState("");
    const [quizOptions, setQuizOptions] = useState([]);

    const navigate = useNavigate();

    const redirectToLogin = () => {
        window.location.href = "/notFound";
    };
    

    const callQuizByType = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            console.log("config", config);
            if (qValue === "ALL") {
                const apiUrl = `${serverURL}/api/admin/getquiz`;
                const response = await fetch(apiUrl, config);
                const data = await response.json();
                console.log("data", data);
                if (data.code === 401 || data.code === 498) {
                    console.error("Error fetching categories due to unauthorization");
                }
                return data.data;
            }
            console.log("qValue", qValue)
            const response = await axios.post(`${serverURL}/api/admin/quizByType`,
                {
                    type: qValue,
                },
                config
            );
            const data = response.data;
            console.log("data", data);
            if (data.code === 401 | data.code === 498) {
                console.error("Error fetching categories due to unauthorization");
            }
            return data.data;
        } catch (error) {
            console.error(error);
            if (error.response && (error.response.status === 401 || error.response.status === 498)) {
                console.error("Unauthorized: Please log in");
                window.location.href = "/notFound";
            }

        }
    }

    const fetchQuiz = async () => {
        try {
            const data = await callQuizByType();
            // Extract the category_name from the response data
            const options = data.map((quiz) => ({
                quiz_name: quiz.quiz_name,
                quiz_id: quiz.id
            }));
            setQuizOptions(options);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    useEffect(() => {
        fetchQuiz(); // Fetch categories when the component mounts
    }, []);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await fetch(`${serverURL}/api/admin/questionbyid/${questionId}`, {
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
                setInputValues(data.data[0]);
                localStorage.setItem("questionData", JSON.stringify(data));

            } catch (error) {
                console.error(error);
            }
        };

        if (questionId) {
            fetchQuestion();
        }
    }, [questionId]);

    const handleInputChange = (e) => {
        console.log(e.target.name);
        setInputValues({
            ...inputValues,
            [e.target.name]: e.target.value
        });
        console.log(inputValues);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = {
            question_id: questionId,
            quiz_id: parseInt(inputValues.quiz_id),
            question: inputValues.question,
            option_1: inputValues.option_1,
            option_2: inputValues.option_2,
            option_3: inputValues.option_3,
            option_4: inputValues.option_4,
            correct_option: inputValues.correct_option,
            status: parseInt(inputValues.status),
        };

        try {
            const response = await fetch(`${serverURL}/api/admin/updatequestion`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                if (data.code === 401 || data.code === 498) {
                    console.error("Unauthorized: Please log in");
                    window.location.href = "/notFound";
                }
            } else {
                const data = await response.json();
                console.log("Response from API", data);
                // Navigate to the desired page after API response
                navigate(`/question/${questionId}?q=${qValue}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {!token && redirectToLogin()}
            {token && (
                <div className="update">
                    <Sidebar />
                    <div className="updateContainer">
                        <Navbar />
                        <div className="top">
                            <h1>{title}</h1>
                        </div>
                        <div className="bottom">
                            <div className="right">
                                <form onSubmit={handleUpdate}>
                                    {questionInputs.map((input) => (
                                        <div className="formInput" key={input.id}>
                                            <label>{input.label}</label>
                                            {input.fieldName === "quiz_id" ? (
                                                <select
                                                    name={input.fieldName}
                                                    onChange={handleInputChange}
                                                    value={inputValues[input.fieldName] || ''}
                                                    required
                                                >
                                                    <option value="">Select</option>
                                                    {quizOptions.map((option) => (
                                                        <option key={option.quiz_id} value={option.quiz_id}>
                                                            {option.quiz_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                input.type === "dropdown" ? (
                                                    <select
                                                        name={input.fieldName}
                                                        value={inputValues[input.fieldName] || ''}
                                                        onChange={handleInputChange}
                                                        required
                                                    >
                                                        {input.options.map((option) => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type={input.type}
                                                        placeholder={input.placeholder}
                                                        value={inputValues[input.fieldName] || ''}
                                                        name={input.label.toLowerCase().split(" ").join("")}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                )
                                            )}
                                        </div>
                                    ))}        
                                    {/* {questionInputs.map((input) => (
                                        <div className="formInput" key={input.id}>
                                            <label>{input.label}</label>
                                            <input
                                                type={input.type}
                                                placeholder={input.placeholder}
                                                name={input.fieldName}
                                                value={inputValues[input.fieldName] || ''}
                                                onChange={handleInputChange}
                                                required
                                            // inputMode={input.fieldName === 'no_of_quiz' ? 'numeric' : undefined}
                                            />
                                        </div>
                                    ))} */}
                                    <div style={{ clear: "both" }} className="formUpdate">
                                        <button
                                            style={{ float: "right" }}
                                        // onClick={() => navigate(`/categories/${questionId}`)}
                                        >
                                            Update
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            style={{ float: "right" }}
                                            onClick={() => navigate(`/question/${questionId}`)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                )
            }
        </>
    );
};

export default QuestionUpdate;