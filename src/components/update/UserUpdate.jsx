import "./update.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { categoryInputs, userInputs } from "../../formSource";
import { serverURL } from "../../temp";


const UserUpdate = ({ title }) => {

    // Extracting userId using regular expressions
    const location = useLocation();
    const userId = location.pathname.match(/\/user\/update\/(\d+)/)?.[1];
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const qValue = queryParams.get("q");


    // Initializing state
    const [file, setFile] = useState(null);
    const [inputValues, setInputValues] = useState("");
    let [token] = useState(localStorage.getItem("token"));

    const redirectToLogin = () => {
        window.location.href = "/notFound";
    };

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await fetch(`${serverURL}/api/admin/studentbyid/${userId}`,
                    config
                );

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
                localStorage.setItem("userData", JSON.stringify(data));

            } catch (error) {
                console.error(error);
                if (error.response && (error.response.status === 401 || error.response.status === 498)) {
                    console.error("Unauthorized: Please log in");
                    window.location.href = "/notFound";
                }
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId]);

    const handleInputChange = (e) => {
        setInputValues({
            ...inputValues,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = {
            user_id: parseInt(userId),
            name: inputValues.name,
            email_id: inputValues.email_id,
            gender: inputValues.gender,
            mobile_number: parseInt(inputValues.mobile_number),
            status: parseInt(inputValues.status),
            type: inputValues.type,
        };

        console.log("formData",formData);

        try {
            const response = await fetch(`${serverURL}/api/admin/updateuser`, {
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
                navigate(`/user/${userId}?q=${qValue}`);
            }
        } catch (error) {
            console.error(error);
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
                <div className="update">
                    <Sidebar />
                    <div className="updateContainer">
                        <Navbar />
                        <div className="top">
                            <h1>{title}</h1>
                        </div>
                        <div className="bottom">
                            {/* <div className="left">
                                <img
                                    src={
                                        file
                                    }
                                    alt=""
                                    className="itemImg"
                                />
                            </div> */}
                            <div className="right">
                                <form onSubmit={handleUpdate}>
                                    {/* <div className="formInput">
                                        <label htmlFor="file">
                                            Image: <DriveFolderUploadOutlinedIcon className="icon" />
                                        </label>
                                        <input
                                            type="file"
                                            id="file"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            style={{ display: "none" }}
                                        />
                                    </div> */}
                                    {userInputs
                                        .filter((input) => input.fieldName !== 'password')
                                        .map((input) => (
                                        <div className="formInput" key={input.id}>
                                            <label>{input.label}</label>
                                            {input.type === "dropdown" && input.fieldName === "type" ? (
                                                <select
                                                    name={input.fieldName}
                                                    onChange={handleInputChange}
                                                    required
                                                    value={qValue !== "ALL" ? qValue : inputValues[input.fieldName]}
                                                    disabled={qValue !== "ALL"}
                                                >
                                                    {input.options.map((option) => (
                                                        <option key={option.key} value={option.value}>
                                                            {option.key}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : input.type === "dropdown" ? (
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
                                                    name={input.fieldName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            )}
                                        </div>
                                    ))}
                                    <div style={{ clear: "both" }} className="formUpdate">
                                        <button
                                            style={{ float: "right" }}
                                        >
                                            Update
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            style={{ float: "right" }}
                                            onClick={() => navigate(`/user/${userId}?q=${qValue}`)}
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

export default UserUpdate;