import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from "../axiosConfig";

const LoginPage = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

//handling login function
  const handleLogin = async (e) => {
    e.preventDefault();
    const loginData = { userName, password };

    try {
      const response = await api.post('/api/users/login', loginData);
      console.log("Login data:", loginData);
      if (response.data.clientId == null) {
        setError(response.data.msg);
      } else {
      const { token } = response.data;
      console.log("Response data:", response.data);
      localStorage.setItem('token', token); // Store the token in localStorage
      navigate('/tasks'); 
      }
    } catch (error) {
      setError('Incorrect username or password'); 
      console.error("Login error:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow" style={{ width: '400px' }}>
        <h2 className="card-title text-center mb-4">Login</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-control" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;