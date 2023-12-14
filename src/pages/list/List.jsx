import "./list.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Datatable from "../../components/datatable/Datatable"
import { useState } from "react"

const List = () => {
  let [token] = useState(localStorage.getItem("token"));

  const redirectToLogin = () => {
    window.location.href = "/notFound";
  };

  return (
    <>
      {!token && redirectToLogin()} 
      {token && (
        <div className="list">
          <Sidebar/>
          <div className="listContainer">
            <Navbar/>
            <Datatable/>
          </div>
        </div>
        )
      }
    </>
  );
};

export default List