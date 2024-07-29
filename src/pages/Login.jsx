import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (email === 'admin' && password === 'admin') {
      localStorage.setItem('token', 'admin-token');
      localStorage.setItem('userId', 'admin');
      localStorage.setItem('role', 'admin');
      navigate('/');
    } else {
      try {
        const response = await axios.post('http://localhost:8080/patients/login', { email, password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('role', 'user');
        navigate('/');
      } catch (err) {
        setError('Correo o contraseña incorrectos');
      }
    }
  };

  const navigateToRegister = () => {
    navigate('/register'); // Redirigir a la página de registro
  };

  return (
    <div className="login-container">
      <h2 className="text-center">Ingrese sus credenciales</h2>
      <form onSubmit={handleLogin} noValidate>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email:</label>
          <input type="email" id="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Contraseña:</label>
          <input type="password" id="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <button type="submit" className="btn btn-primary w-100">Acceder</button>
      </form>
      <div className="mt-3">
        <button className="btn btn-success" onClick={navigateToRegister}>Regístrate aquí</button>
      </div>
    </div>
  );
};

export default Login;
