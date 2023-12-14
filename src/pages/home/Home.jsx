import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Chart from "../../components/chart/Chart";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../../temp";

const Home = () => {
  const [ token ] = useState(localStorage.getItem("token"));
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const qValue = queryParams.get("q");
  const [homeStats, setHomeStats] = useState(null);
  const [loading, setLoading] = useState(true);
  // Initialize the selected option from local storage or set it to 'ALL' if it's not in local storage
  const initialSelectedOption = localStorage.getItem("selectedOption") || "ALL";

  const redirectToLogin = () => {
    // alert("Please Login first, then you can access this page...");
    window.location.href = "/notFound"; // Replace "/login" with the actual login page path
  };

  const fetchHomeStats = async (qValue) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(`${serverURL}/api/admin/homeStats`, 
        {
          type: qValue,
        },
        config
      );
      const data = response.data;

      console.log("Data from API", data);
      setHomeStats(data.data[0]);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Please log in");
        redirectToLogin(); // Redirect
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (token) {
          await fetchHomeStats(qValue);
          setLoading(false); // Set loading to false after data is fetched
        } else {
          redirectToLogin();
        }
      } catch (error) {
        setLoading(false); // Set loading to false in case of error
        redirectToLogin();
      }
    };
    fetchData();
  }, [token, qValue]);

  return (
    <>
      {!token && redirectToLogin()}
      {token && (
        <div className="home">
          <Sidebar />
          <div className="homeContainer">
            <Navbar />
            {loading ? <h1 style={{ textAlign: "center", paddingTop: "20%" }}>loading...</h1> :
              <>
                <div className="widgets">
                  <Widget type="user" input={homeStats.user} />
                  <Widget type="category" input={homeStats.category} />
                  <Widget type="quiz" input={homeStats.quiz} />
                  <Widget type="question" input={homeStats.question} />
                </div>
                <div className="charts">
                  {/* <Featured /> */}
                  <Chart title="Attempted Quizzes by Distinct Users" aspect={2 / 1} />
                </div>
              </>
            }
            {/* <div className="listContainer">
              <div className="listTitle">Latest Transactions</div>
              <Table />
            </div> */}
          </div>
        </div>
      )
    }
    </>
  );
};

export default Home;