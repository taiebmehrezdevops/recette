import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8800/api/login', { username, password });
      if (response.data.success) {
        const userid = response.data.user.userid;
        localStorage.setItem('userid', userid);
        localStorage.setItem('username', username);
        navigate(`/home/${userid}`);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage('Error logging in');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4">
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">Login</button>
        </form>
        {message && <p className="mt-3 text-danger text-center">{message}</p>}
      </div>
    </div>
  );
};

export default LoginForm;
