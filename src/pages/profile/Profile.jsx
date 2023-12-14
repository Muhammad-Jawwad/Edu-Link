import { useState } from 'react';
import './profile.scss';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';

const Profile = () => {
    let [token] = useState(localStorage.getItem("token"));
    let [data] = useState(JSON.parse(localStorage.getItem("adminData"))); // Parse the data string into an object

    const redirectToLogin = () => {
        alert("Please login first, then you can access this page...");
        window.location.href = '/'; // Replace "/login" with the actual login page path
    };

    return (
        <>
            {!token && redirectToLogin()}
            {token && (
                <div className="profile">
                    <Sidebar />
                    <div className="profileContainer">
                        <Navbar />
                        <div className="top">
                            <div className="left">
                                <h1 className="title">Admin Information</h1>
                                <div className="item">
                                    <img src={data.profile_picture} alt="" className="itemImg" />
                                    <div className="details">
                                        <h1 className="itemTitle">{data.name}</h1>
                                        <div className="detailItem">
                                            <span className="itemKey">Id:</span>
                                            <span className="itemValue">{data.id}</span>
                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Gender:</span>
                                            <span className="itemValue">{data.gender}</span>
                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Email Id:</span>
                                            <span className="itemValue">{data.email_id}</span>
                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Contact:</span>
                                            <span className="itemValue">{data.mobile_number}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Profile;
