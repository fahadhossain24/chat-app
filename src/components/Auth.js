// src/components/Auth.js
import React, { useState } from 'react';
import axios from 'axios';

function Auth({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(true);
  const [error, setError] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isRegister ? 'http://localhost:3001/register' : 'http://localhost:3001/login';
      console.log(url)
      const { data } = await axios.post(url, { username, password });
      localStorage.setItem('token', data.token);
      setUser(username);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="auth-container">
      <h1>{isRegister ? 'Register' : 'Login'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
        {error && <p className="error">{error}</p>}
        <button type="button" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </form>
    </div>
  );
}

export default Auth;
