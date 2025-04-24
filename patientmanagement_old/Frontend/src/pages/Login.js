import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8081/login', { username, password });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('doctorAddress', response.data.doctorAddress);
        localStorage.setItem('docId', response.data.docId);
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Server error. Try again later.');
    }
  };

  // Inline style for background image
  const backgroundStyle = {
    backgroundImage: 'url("../images/1.jfif")', // URL of your background image
    backgroundSize: 'cover', // Make the background cover the entire container
    backgroundPosition: 'center', // Center the background image
    height: '100vh', // Full height of the viewport
    display: 'flex', // Use flexbox for centering the content
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
  };

  return (
    <div style={backgroundStyle}>
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
