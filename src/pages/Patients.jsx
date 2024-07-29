import React, { useEffect, useState } from 'react';
import patientService from '../services/patientService';
import '../styles/Patients.css';
import defaultUserImage from '../images/defaultUser.png'; // Imagen predeterminada para usuarios

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllPatients();
  }, []);

  const fetchAllPatients = async () => {
    try {
      const response = await patientService.getAllPatients();
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleEditPatient = (patient) => {
    setEditingPatientId(patient.id);
    setFirstName(patient.firstName);
    setLastName(patient.lastName);
    setEmail(patient.email);
    setPhone(patient.phone);
    setAddress(patient.address);
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const updatedPatient = {
        firstName,
        lastName,
        email,
        phone,
        address,
      };
      await patientService.updatePatient(editingPatientId, updatedPatient);
      setEditingPatientId(null);
      fetchAllPatients();
    } catch (err) {
      console.error('Error updating patient:', err);
      setError('Error al actualizar la información del paciente. Intente nuevamente.');
    }
  };

  const handleDeletePatient = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este paciente?")) {
      try {
        await patientService.deletePatient(id);
        fetchAllPatients();
      } catch (err) {
        console.error('Error deleting patient:', err);
        setError('Error al eliminar al paciente. Intente nuevamente.');
      }
    }
  };

  return (
    <div className="patients-container">
      <h1>Lista de Pacientes</h1>
      {editingPatientId && (
        <form onSubmit={handleUpdatePatient} className="patient-form">
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Apellido:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Teléfono:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Dirección:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <button type="submit" className="btn btn-primary">
            Actualizar Paciente
          </button>
        </form>
      )}
      <div className="patients-list">
        {patients.map((patient) => (
          <div className="patient-card" key={patient.id}>
            <img src={defaultUserImage} alt="Paciente" className="patient-image" />
            <h3>{patient.firstName} {patient.lastName}</h3>
            <p><strong>Email:</strong> {patient.email}</p>
            <p><strong>Teléfono:</strong> {patient.phone}</p>
            <p><strong>Dirección:</strong> {patient.address}</p>
            <button onClick={() => handleEditPatient(patient)} className="btn btn-secondary">Editar</button>
            <button onClick={() => handleDeletePatient(patient.id)} className="btn btn-danger">Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Patients;
