import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { categoryInputs, userInputs } from "../../formSource";
import { serverURL } from "../../temp";
import axios from "axios";
import toast from "react-hot-toast";

const UserNew = ({ title }) => {
    // const [file, setFile] = useState(null);
    const [shouldResetForm, setShouldResetForm] = useState(false);
    const token = localStorage.getItem("token");
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const qValue = queryParams.get("q");
    const [inputValues, setInputValues] = useState({ type: qValue === "ALL" ? "ECAT": qValue });

    console.log("qValue", qValue)
    const redirectToLogin = () => {
        window.location.href = "/notFound";
    };

    const handleInputChange = (e) => {
        console.log(e.target.name);
        setInputValues({
            ...inputValues,
            [e.target.name]: e.target.value
        });
        console.log("inputValues", inputValues)
    };

    useEffect(() => {
        if (shouldResetForm) {
            setInputValues({});
            // setFile(null);
            setShouldResetForm(false);
        }
    }, [shouldResetForm]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            name: inputValues.name,
            email_id: inputValues.email_id,
            password: inputValues.password,
            gender: inputValues.gender,
            mobile_number: parseInt(inputValues.mobile_number),
            type: inputValues.type
        };

        console.log("formData", formData);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
            const response = await axios.post(`${serverURL}/api/admin/createuser`, formData, config);
            console.log("Response from API", response);
            const data = response.data;
            console.log("Data from API", data);

            if (!response.status === 200) {
                if (data.code === 401 || data.code === 498) {
                    console.error("Unauthorized: Please log in");
                    window.location.href = "/notFound";
                }
            }
            toast.success("New User Successfully Created!");
            // console.log("Response from API", data);

            // Reset the form
            // setFile("");
            setInputValues({ type: qValue === "ALL" ? "ECAT" : qValue });
            window.location.href = `/user/new?q=${qValue}`;
            console.log("Input values after reset:", inputValues);
            setShouldResetForm(true);
        } catch (error) {
            if(error.response.data.errors.length !== 0){
                toast.error(error.response.data.errors[0].msg);
            }
            // Handle network errors and provide user feedback
            if (error.response && (error.response.status === 401 || error.response.status === 498)) {
                console.error("Unauthorized: Please log in");
                window.location.href = "/notFound";
            }
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
                                    {userInputs
                                        .filter((input) => input.fieldName !== 'status')
                                        .map((input) => (
                                            <div className="formInput" key={input.id}>
                                                <label>{input.label}</label>
                                                {
                                                    (input.fieldName === "type")  ? (
                                                        <select
                                                            name={input.fieldName}
                                                            onChange={handleInputChange}
                                                            required
                                                            value={qValue !== "ALL" ? qValue : inputValues.type} // Set value based on the condition
                                                            disabled={qValue !== "ALL"} // Disable the dropdown when qValue is not "ALL"

                                                        >
                                                            {input.options.map((option) => (
                                                                <option key={option.key} value={option.value}>
                                                                    {option.key}
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
                                                    )
                                                }
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

export default UserNew;