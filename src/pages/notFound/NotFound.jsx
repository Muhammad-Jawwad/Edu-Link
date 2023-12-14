import React from 'react';
import { Link } from 'react-router-dom';
import './notFound.scss';

const NotFoundPage = () => {
    return (
        <div className="notFound">
            <div className="notFoundContainer">
                <h1 className="notFoundTitle">404 Not Found</h1>
                <p className="notFoundMessage">Unauthorized. Please log in to access this page.</p>
                <Link to="/" className="loginButton" onClick={() => { localStorage.clear() }}>
                    Go to Login
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
