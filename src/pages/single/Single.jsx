import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './single.scss';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import { Link } from "react-router-dom";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import { serverURL } from '../../temp';

const Single = () => {
  // Extracting categoryId using regular expressions
  const location = useLocation();
  const categoryId = location.pathname.match(/\/categories\/(\d+)/)?.[1]; 
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const qValue = queryParams.get("q");
  
  const [category, setCategory] = useState(null);
  let [token] = useState(localStorage.getItem("token"));

  const redirectToLogin = () => {
    window.location.href = "/notFound";
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        
        const response = await fetch(`${serverURL}/api/admin/categorybyid/${categoryId}`,
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
        console.log("data",data);
        
        setCategory(data);
        localStorage.setItem("categoryData", JSON.stringify(data));
      } catch (error) {
        console.error(error);
        if (error.response && (error.response.status === 401 || error.response.status === 498)) {
          console.error("Unauthorized: Please log in");
          window.location.href = "/notFound";
        }
      }
    };
    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

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
                  <Link to={`/categories/update/${categoryId}?q=${qValue}`} className=" link">
                    <CreateOutlinedIcon className="icon" />
                  </Link>
                </div>
                <h1 className="title">Category Information</h1>
                <div className="item">
                  <img src={
                    category?.data[0].category_picture
                    } 
                    alt="" 
                    className="itemImg" 
                  />
                  <div className="details">
                    <h1 className="itemTitle">{category?.data[0].category_name}</h1>
                    <div className="detailItem">
                      <span className="itemKey">Id:</span>
                      <span className="itemValue">{category?.data[0].id}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Number of quiz:</span>
                      <span className="itemValue">{category?.data[0].no_of_quiz}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Status:</span>
                      <span className="itemValue">{category?.data[0].status}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Type:</span>
                      <span className="itemValue">{category?.data[0].type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div >
        </div>
        )
      }
    </>
  );
};

export default Single;