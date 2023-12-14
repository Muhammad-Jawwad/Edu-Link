import "./list.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import QuizDatatable from "../../components/datatable/QuizDatatable"
import { useState } from "react"

const QuizList = () => {
    let [token] = useState(localStorage.getItem("token"));

    const redirectToLogin = () => {
        window.location.href = "/notFound";
    };

    return (
        <>
            {!token && redirectToLogin()}
            {token && (
                <div className="list">
                    <Sidebar />
                    <div className="listContainer">
                        <Navbar />
                        <QuizDatatable />
                    </div>
                </div>
                )
            }
        </>
    )
}

export default QuizList