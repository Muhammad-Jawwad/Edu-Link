import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { categoryInputs } from "../../formSource";
import { serverURL } from "../../temp";
import toast from "react-hot-toast";

const New = ({ title }) => {
  const [file, setFile] = useState(null);
  const [shouldResetForm, setShouldResetForm] = useState(false);
  const token = localStorage.getItem("token");
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const qValue = queryParams.get("q");
  const [inputValues, setInputValues] = useState({ type: qValue === "ALL" ? "ECAT" : qValue });

  console.log("qValue",qValue)
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
      setFile(null);
      setShouldResetForm(false);
    }
  }, [shouldResetForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      category_name: inputValues.category_name,
      no_of_quiz: parseInt(inputValues.no_of_quiz, 10),
      type: inputValues.type
    };

    console.log("formData", formData);

    try {
      const response = await fetch(`${serverURL}/api/admin/addcategory`, {
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
      toast.success("New Category successfully created!");
      // Reset the form
      setFile("");
      setInputValues({});
      window.location.href = `/categories/new?q=${qValue}`;
      console.log("Input values after reset:", inputValues);
      setShouldResetForm(true);
    } catch (error) {
      if (error.response.data.errors.length !== 0) {
        toast.error(error.response.data.errors[0].msg);
      }
      console.error("Network error:", error);
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
                      style={{ display: "none" }}
                    />
                  </div>
                  {categoryInputs
                  .filter((input) => input.fieldName !== 'status')
                  .map((input) => (
                    <div className="formInput" key={input.id}>
                      <label>{input.label}</label>
                      {input.type === "dropdown" ? (
                        <select
                          name={input.fieldName}
                          onChange={handleInputChange}
                          required
                          value={qValue !== "ALL" ? qValue : input.fieldName} // Set value based on the condition
                          disabled={qValue !== "ALL"} // Disable the dropdown when qValue is not "ALL"

                        >
                          {input.options.map((option) => (
                            <option key={option.key} value={option.value}>
                              {option.key}
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

export default New;