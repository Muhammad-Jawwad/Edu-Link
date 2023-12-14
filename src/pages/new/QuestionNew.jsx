import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
// import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { questionInputs } from "../../formSource";
import { Link, useLocation } from "react-router-dom";
import { serverURL } from "../../temp";
import axios from "axios";
import toast from "react-hot-toast";

const QuestionNew = ({ title }) => {
    // const [file, setFile] = useState("");
    const [inputValues, setInputValues] = useState({});
    const [quizOptions, setQuizOptions] = useState([]);
    let [token] = useState(localStorage.getItem("token"));
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const qValue = queryParams.get("q");

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
            console.log("options", options)
            setQuizOptions(options);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    useEffect(() => {
        fetchQuiz(); // Fetch categories when the component mounts
    }, []);

    const handleInputChange = (e) => {
        setInputValues({
            ...inputValues,
            [e.target.name]: e.target.value
        });

        console.log("inputValues", inputValues);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            quiz_id: parseInt(inputValues.quiz_id),
            question: inputValues.question,
            option_1: inputValues.option1,
            option_2: inputValues.option2,
            option_3: inputValues.option3,
            option_4: inputValues.option4,
            correct_option: inputValues.correctoption
        };

        try {
            // Send formData to the server using an HTTP request
            const response = await fetch(`${serverURL}/api/admin/addquestion`, {
                method: "POST",
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
            } 

            const data = await response.json();

            // Store formData in local storage
            localStorage.setItem("formData", JSON.stringify(formData));
            toast.success("New Question successfully created!");
            // Reset the form
            setInputValues({});
            window.location.href = `/question/new?q=${qValue}`;

        } catch (error) {
            if (error.response.data.errors.length !== 0) {
                toast.error(error.response.data.errors[0].msg);
            }
            console.log(error);
        }
    };

    return (
        <>
            {!token && redirectToLogin()}
            {token && (
                <div className="new">
                    <Sidebar />
                    <div className="newContainer">
                        <Navbar />
                        <div className="top">
                            <h1>{title}</h1>
                        </div>
                        <div className="bottom">
                            {/* <div className="left">
                                <img
                                    src={
                                        file
                                            ? URL.createObjectURL(file)
                                            : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                                    }
                                    alt=""
                                />
                            </div> */}
                            <div className="right">
                                <form onSubmit={handleSubmit}>
                                    {questionInputs
                                        .filter((input) => input.fieldName !== 'status')
                                        .map((input) => (
                                        <div className="formInput" key={input.id}>
                                            <label>{input.label}</label>
                                                {input.fieldName === "quiz_id" ? (
                                                <select
                                                    name={input.fieldName}
                                                    onChange={handleInputChange}
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
                                                <input
                                                    type={input.type}
                                                    placeholder={input.placeholder}
                                                    name={input.label.toLowerCase().split(" ").join("")}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            )}
                                        </div>
                                    ))}
                                    <div style={{ clear: "both" }} className="formSubmit">
                                        <button type="submit" style={{ float: "right" }}>Submit</button>
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

export default QuestionNew;