import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.scss';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { serverURL } from '../../temp';
import toast from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      email_id: username,
      password: password,
    };

    // Convert formData to a JSON string
    const formDataString = JSON.stringify(formData);

    // Store formDataString in local storage
    localStorage.setItem('formData', formDataString);

    // Send formData to the server using an HTTP request
    fetch(`${serverURL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: formDataString,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error: ' + response.status);
        }
      })
      .then((data) => {
        console.log('Response from API', data);

        if (data.status === true) {
          toast.success('Successfully Login!');
          console.log("token", data.token);
          // Redirect to "home" page
          localStorage.setItem("token", data.token);

          // Storing adminData in localStorage
          localStorage.setItem("adminData", JSON.stringify(data.data));

          const type = data.data.type;
          
          if (type === 'ADMIN') {
            localStorage.setItem("type", "ALL");
            navigate(`/home?q=ALL`);
          } else {
            localStorage.setItem("type", type);
            navigate(`/home?q=${type}`);
          }

        } else {
          // Set error message and clear username/password
          setError('Invalid username or password!');
          toast.error(`${data.message}`);
          setUsername('');
          setPassword('');
        }
      })
      .catch((error) => {
        console.log(error);
        setError('An error occurred. Please try again.');
        toast.error('This is an error!');
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login">
      <header className="header">
        <h1 className="dashboardHeading">~ Quiz Dashboard ~</h1>
      </header>
      <div className="loginFormContainer">
        <form className="loginForm" onSubmit={handleSubmit}>
          <h4>Login</h4>
          <div className="formGroup">
            <label htmlFor="username">Email</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div className="formGroup">
            <label htmlFor="password">Password</label>
            <TextField
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit">Log In</button>
        </form>
      </div>
      <footer className="footer">
        <Link to="/quizLogin" style={{ textDecoration: "none" }}>
          Do you want to login as a student?
        </Link>
      </footer>
    </div>
  );
};

export default Login;
