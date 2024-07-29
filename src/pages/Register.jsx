import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Register.css';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:8080/patients', {
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
      });
      setSuccess('Registro exitoso! Redirigiendo al login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError('Error al registrar. Intente nuevamente.');
    }
  };

  return (
    <div className="register-container">
      <h2 className="text-center">Ingresa tus datos para registrarte</h2>
      <form onSubmit={handleRegister} noValidate>
        <div className="form-group">
          <label htmlFor="firstName" className="form-label">Nombre:</label>
          <input type="text" id="firstName" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="lastName" className="form-label">Apellido:</label>
          <input type="text" id="lastName" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email:</label>
          <input type="email" id="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Contraseña:</label>
          <input type="password" id="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone" className="form-label">Teléfono:</label>
          <input type="text" id="phone" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="address" className="form-label">Dirección:</label>
          <input type="text" id="address" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {success && <div className="alert alert-success" role="alert">{success}</div>}
        <button type="submit" className="btn btn-primary w-100">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
