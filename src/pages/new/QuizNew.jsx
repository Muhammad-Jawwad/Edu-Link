import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import { quizInputs } from "../../formSource";
import { Link, useLocation } from "react-router-dom";
import { serverURL } from "../../temp";
import axios from "axios";
import toast from "react-hot-toast";

const QuizNew = ({ title }) => {
    const [file, setFile] = useState("");
    const [inputValues, setInputValues] = useState({});
    const [categoryOptions, setCategoryOptions] = useState([]);
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const qValue = queryParams.get("q");
    let [token] = useState(localStorage.getItem("token"));

    const redirectToLogin = () => {
        window.location.href = "/notFound";
    };

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

    const handleInputChange = (e) => {
        console.log(e.target.name);
        setInputValues({
            ...inputValues,
            [e.target.name]: e.target.value
        });
        console.log("inputValues", inputValues)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            category_id: parseInt(inputValues.category_id),
            quiz_no: inputValues.quiz_no,
            picture: file ? URL.createObjectURL(file) : "",
            quiz_name: inputValues.quiz_name,
            no_of_questions: parseInt(inputValues.no_of_questions),
            description: inputValues.description,
            no_of_attempts: inputValues.no_of_attempts,
            duration: parseInt(inputValues.duration)
        };
        console.log("formData: ", formData);

        try {
            // Send formData to the server using an HTTP request
            const response = await fetch(`${serverURL}/api/admin/addquiz`, {
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
            console.log("Response from API", data);

            // Store formData in local storage
            localStorage.setItem("formData", JSON.stringify(formData));
            toast.success("New Quiz Successfully Created!");
            // Reset the form
            setFile("");
            setInputValues({});
            window.location.href = `/quizList/new?q=${qValue}`;
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
                            <div className="left">
                                <img
                                    src={
                                        file
                                            ? URL.createObjectURL(file)
                                            : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                                    }
                                    alt=""
                                />
                            </div>
                            <div className="right">
                                <form onSubmit={handleSubmit}>
                                    <div className="formInput">
                                        <label htmlFor="file">
                                            Image: <DriveFolderUploadOutlinedIcon className="icon" />
                                        </label>
                                        <input
                                            type="file"
                                            id="file"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            style={{
                                                position: "absolute",
                                                left: "-9999px", // Position the input off-screen
                                            }}
                                        />
                                        {/* <input
                                            type="file"
                                            id="file"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            style={{ display: "none" }}
                                            required
                                        /> */}
                                    </div>
                                    {quizInputs
                                        .filter((input) => input.fieldName !== "status")
                                        .map((input) => (
                                            <div className="formInput" key={input.id}>
                                                <label>{input.label}</label>
                                                {input.fieldName === "category_id" ? (
                                                    <select
                                                        name={input.fieldName}
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
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    )
                                                )}
                                            </div>
                                        ))}
                                    {/* {quizInputs
                                        .filter((input) => input.fieldName !== 'status')
                                        .map((input) => (
                                            <div className="formInput" key={input.id}>
                                                <label>{input.label}</label>
                                                {input.type === "dropdown" ? (
                                                    <select
                                                        name={input.fieldName}
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
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                )}
                                            </div>
                                        ))} */}
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

export default QuizNew;
