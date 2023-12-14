import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./sidebar.scss";

import {
  Dashboard as DashboardIcon,
  PersonOutline as PersonOutlineIcon,
  CreditCard as QuestionAnswerOutlinedIcon,
  Store as StoreIcon,
  ExitToApp as ExitToAppIcon,
  AccountCircleOutlined as AccountCircleOutlinedIcon,
  CategoryOutlined as CategoryOutlinedIcon,
  QuizOutlined as QuizOutlinedIcon,
} from "@mui/icons-material";

import { DarkModeContext } from "../../context/darkModeContext";
import { serverURL } from "../../temp";

const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const qValue = queryParams.get("q");

  const [selectedOption, setSelectedOption] = useState(localStorage.getItem("selectedOption"));
  const [selectedCategory, setSelectedCategory] = useState(localStorage.getItem("selectedCategory"));
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [type] = useState(localStorage.getItem("type"));
  const [token] = useState(localStorage.getItem("token"));

  const navigate = useNavigate();
  const location = useLocation();
  const url = location.pathname;
  const renderSidebar = url === "/quiz";
  const dropdownRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selectedOptionFromQuery = params.get("q");

    if (selectedOptionFromQuery) {
      setSelectedOption(selectedOptionFromQuery);
    }
    localStorage.setItem("selectedOption", selectedOption);
  }, [location, selectedOption]);

  const handleOptionChange = (option) => {
    const newUrl = option === "ALL" ? `${url}?q=${option}` : `${url}?q=${option}`;
    window.location.href = newUrl;
    setSelectedOption(option);
  };

  const callCategoryByType = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const apiUrl = qValue === "ALL" ? `${serverURL}/api/admin/getcategory` : `${serverURL}/api/users/categoryByType`;

      const response = await axios.post(apiUrl, { type: qValue }, config);
      const data = response.data;

      if (data.code === 401 || data.code === 498) {
        console.error("Error fetching categories due to unauthorization");
      }

      return data.data;
    } catch (error) {
      console.error(error);

      if (error.response && (error.response.status === 401 || error.response.status === 498)) {
        console.error("Unauthorized: Please log in");
        redirectToLogin();
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await callCategoryByType();

      const options = data.map((category) => ({
        category_name: category.category_name,
        category_id: category.id,
      }));

      setCategoryOptions(options);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useEffect(() => {
    if (renderSidebar) {
      fetchCategories();
    }
  }, [renderSidebar]);

  const handleCategoryChange = (e) => {
    const option = e.target.value;
    setSelectedCategory(option);
    localStorage.setItem("selectedCategory", option);

    navigate(`/quiz?q=${qValue}&&id=${option}`);
  };

  const redirectToLogin = () => {
    window.location.href = "/notFound";
  };

  const options = [
    {
      key: "ALL",
      value: "ALL"
    },
    {
      key: "ECAT",
      value: "ECAT"
    },
    {
      key: "MCAT",
      value: "MCAT"
    },
    {
      key: "Entry Test",
      value: "ET"
    }
  ];

  return (
    <div className="sidebar">
      <div className="top">
        <Link to={!renderSidebar ? `/home?q=${selectedOption}` : `/quiz?q=${qValue}&&id=${selectedCategory}`} style={{ textDecoration: "none" }}>
          <span className="logo">{!renderSidebar ? "Quiz Dashboard" : "Quiz"}</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          {!renderSidebar ? (
            <>
              <p className="title">Dashboard</p>
              <div className="dropdown">
                <select
                  value={selectedOption}
                  onChange={(e) => handleOptionChange(e.target.value)}
                  disabled={type === "MCAT" || type === "ECAT" || type === "ET"}
                >
                  {options.map((opt) => (
                    <option key={opt.key} value={opt.value}>
                      {opt.key}
                    </option>
                  ))}
                </select>
              </div>
              <p className="title">LISTS</p>
              <Link to={`/user?q=${selectedOption}`} style={{ textDecoration: "none" }}>
                <li>
                  <PersonOutlineIcon className="icon" />
                  <span>Users</span>
                </li>
              </Link>
              <Link to={`/categories?q=${selectedOption}`} style={{ textDecoration: "none" }}>
                <li>
                  <CategoryOutlinedIcon className="icon" />
                  <span>Categories</span>
                </li>
              </Link>
              <Link to={`/quizList?q=${selectedOption}`} style={{ textDecoration: "none" }}>
                <li>
                  <QuizOutlinedIcon className="icon" />
                  <span>Quizzes</span>
                </li>
              </Link>
              <Link to={`/question?q=${selectedOption}`} style={{ textDecoration: "none" }}>
                <li>
                  <QuestionAnswerOutlinedIcon className="icon" />
                  <span>Questions</span>
                </li>
              </Link>
              <p className="title">USER</p>
              <Link to="/profile" style={{ textDecoration: "none" }}>
                <li>
                  <AccountCircleOutlinedIcon className="icon" />
                  <span>Profile</span>
                </li>
              </Link>
            </>
          ) : (
            <>
              <p className="title">Select Category</p>
              <div className="dropdown">
                <select value={selectedCategory} onChange={(e) => handleCategoryChange(e)}>
                  <option value="">Select</option>
                  {categoryOptions.map((option) => (
                    <option key={option.category_id} value={option.category_id}>
                      {option.category_name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          <li onClick={() => localStorage.clear()}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <ExitToAppIcon className="icon" />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
