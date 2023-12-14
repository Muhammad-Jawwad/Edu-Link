import "./update.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { quizInputs } from "../../formSource";
import { serverURL } from "../../temp";
import axios from "axios";


const QuizUpdate = ({ title }) => {

    // Extracting quizId using regular expressions
    const location = useLocation();
    const quizId = location.pathname.match(/\/quizList\/update\/(\d+)/)?.[1];
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const qValue = queryParams.get("q");
    const [categoryOptions, setCategoryOptions] = useState([]);

    // Initializing state
    const [file, setFile] = useState(null);
    const [inputValues, setInputValues] = useState("");
    let [token] = useState(localStorage.getItem("token"));

    const redirectToLogin = () => {
        window.location.href = "/notFound";
    };

    const navigate = useNavigate();

    const callCategoryByType = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            console.log("config", config);
            if (qValue === "ALL") {
                const apiUrl = `${serverURL}/api/admin/getcategory`;
                const response = await fetch(apiUrl, config);
                const data = await response.json();
                console.log("data", data);
                if (data.code === 401 || data.code === 498) {
                    console.error("Error fetching categories due to unauthorization");
                }
                return data.data;
            }
            console.log("qValue", qValue)
            const response = await axios.post(`${serverURL}/api/admin/categoryByType`,
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

    const fetchCategories = async () => {
        try {
            const data = await callCategoryByType();
            // Extract the category_name from the response data
            const options = data.map((category) => ({
                category_name: category.category_name,
                category_id: category.id
            }));
            console.log("options", options)
            setCategoryOptions(options);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    useEffect(() => {
        fetchCategories(); // Fetch categories when the component mounts
    }, []);

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
                setInputValues(data.data[0]);
                setFile(data.data[0].picture);
                localStorage.setItem("quizData", JSON.stringify(data));

            } catch (error) {
                console.error(error);
            }
        };

        if (quizId) {
            fetchQuiz();
        }
    }, [quizId]);
    // console.log("quiz in a state:", file);

    const handleInputChange = (e) => {
        setInputValues({
            ...inputValues,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        console.log("inputValues", inputValues);
        const formData = {
            quiz_id: parseInt(quizId),
            category_id: parseInt(inputValues.category_id),
            quiz_no: inputValues.quiz_no,
            picture: file || "",
            quiz_name: inputValues.quiz_name,
            no_of_questions: parseInt(inputValues.no_of_questions),
            description: inputValues.description,
            status: parseInt(inputValues.status),
            duration: parseInt(inputValues.duration),
            no_of_attempts: inputValues.no_of_attempts,
        };

        console.log("formData", formData);

        try {
            const response = await fetch(`${serverURL}/api/admin/updatequiz`, {
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
                navigate(`/quizList/${quizId}?q=${qValue}`);
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
                            <div className="left">
                                <img
                                    src={
                                        file
                                    }
                                    alt=""
                                    className="itemImg"
                                />
                            </div>
                            <div className="right">
                                <form onSubmit={handleUpdate}>
                                    <div className="formInput">
                                        <label htmlFor="file">
                                            Image: <DriveFolderUploadOutlinedIcon className="icon" />
                                        </label>
                                        <input
                                            type="file"
                                            id="file"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            style={{ display: "none" }}
                                        />
                                    </div>
                                    {quizInputs.map((input) => (
                                        <div className="formInput" key={input.id}>
                                            <label>{input.label}</label>
                                            {input.fieldName === "category_id" ? (
                                                <select
                                                    name={input.fieldName}
                                                    value={inputValues[input.fieldName] || ''}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option value="">Select</option>
                                                    {categoryOptions.map((option) => (
                                                        <option key={option.category_id} value={option.category_id}>
                                                            {option.category_name}
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
                                                        name={input.fieldName}
                                                        value={inputValues[input.fieldName] || ''}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                )
                                            )}
                                        </div>
                                    ))}
                                    {/* {quizInputs.map((input) => (
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
                                        // onClick={() => navigate(`/categories/${quizId}`)}
                                        >
                                            Update
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            style={{ float: "right" }}
                                            onClick={() => navigate(`/quizList/${quizId}`)}
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

export default QuizUpdate;