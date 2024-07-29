import React, { useState, useEffect } from 'react';
import recordService from '../services/recordService';
import { useNavigate } from 'react-router-dom';
import '../styles/Records.css';

const treatmentOptions = [
  { name: 'Consulta', price: 10 },
  { name: 'Limpieza de Caries', price: 15 },
  { name: 'Tratamiento de Caries', price: 20 },
  { name: 'Curado de dientes', price: 25 },
  { name: 'Tratamiento para discromia dental', price: 40 }
];

const Records = () => {
  const [records, setRecords] = useState([]);
  const [treatment, setTreatment] = useState('');
  const [date, setDate] = useState('');
  const [cost, setCost] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setIsAuthenticated(true);
      if (role === 'admin') {
        setIsAdmin(true);
        fetchAllRecords();
      } else {
        fetchUserRecords();
      }
    }
  }, []);

  const fetchAllRecords = async () => {
    try {
      const response = await recordService.getAllRecords();
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const fetchUserRecords = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const response = await recordService.getRecordsByPatientId(userId);
        setRecords(response.data);
      }
    } catch (error) {
      console.error('Error fetching user records:', error);
    }
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const patientId = localStorage.getItem('userId');
      if (!patientId) throw new Error('No se encontró el ID del usuario');

      const newRecord = {
        patient: { id: patientId },
        treatment,
        date,
        cost,
        paymentStatus: false,
      };

      await recordService.createRecord(newRecord);
      setTreatment('');
      setDate('');
      setCost(0);
      fetchUserRecords();
    } catch (err) {
      setError('Error al crear la cita. Intente nuevamente.');
    }
  };

  const handleEditRecord = (record) => {
    setEditingRecordId(record.id);
    setTreatment(record.treatment);
    setDate(new Date(record.date).toISOString().slice(0, 16));
    setCost(record.cost);
    setPaymentStatus(record.paymentStatus);
  };

  const handleUpdateRecord = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const updatedRecord = {
        treatment,
        date,
        cost,
        paymentStatus,
      };

      await recordService.updateRecord(editingRecordId, updatedRecord);
      setEditingRecordId(null);
      setTreatment('');
      setDate('');
      setCost(0);
      setPaymentStatus(false);
      fetchAllRecords();
    } catch (err) {
      setError('Error al actualizar la cita. Intente nuevamente.');
    }
  };

  const handleDeleteRecord = async (recordId) => {
    try {
      await recordService.deleteRecord(recordId);
      fetchAllRecords();
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
    }
  };

  const handleTreatmentChange = (e) => {
    const selectedTreatment = e.target.value;
    setTreatment(selectedTreatment);

    const selectedOption = treatmentOptions.find(option => option.name === selectedTreatment);
    if (selectedOption) {
      setCost(selectedOption.price);
    }
  };

  if (!isAuthenticated) {
    return <div className="alert alert-warning">Debes loguearte para agendar una cita.</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{isAdmin ? 'Todas las Citas' : 'Gestiona tus citas'}</h2>
      {isAdmin ? (
        <>
          <ul className="list-group mb-4">
            {records.map((record) => (
              <li key={record.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div className="d-flex flex-row align-items-center">
                <h5> <strong>Paciente:</strong> </h5>
                  <h5 className="me-3">{record.patient.firstName} {record.patient.lastName}</h5>
                  <h5> <strong>Tratamiento:</strong> </h5>
                  <h5 className="me-3">{record.treatment}</h5>
                  <h5> <strong>Fecha:</strong> </h5>
                  <h5 className="me-3">{new Date(record.date).toLocaleString()}</h5>
                  <h5> <strong>Costo:</strong> </h5>
                  <h5 className="me-3">${record.cost}</h5>
                  <h5 className={`badge ${record.paymentStatus ? 'bg-success' : 'bg-warning'}`}>
                    {record.paymentStatus ? 'Pagado' : 'No Pagado'}
                  </h5>
                </div>
                <div>
                  <button className="btn btn-secondary me-2" onClick={() => handleEditRecord(record)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => handleDeleteRecord(record.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
          {editingRecordId && (
            <form onSubmit={handleUpdateRecord} className="card p-4 mb-4">
              <h4>Editar Cita</h4>
              <div className="mb-3">
                <label className="form-label">Tratamiento:</label>
                <select
                  className="form-control"
                  value={treatment}
                  onChange={handleTreatmentChange}
                  required
                >
                  <option value="" disabled>Selecciona un tratamiento</option>
                  {treatmentOptions.map((option) => (
                    <option key={option.name} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Fecha:</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Costo:</label>
                <input
                  type="number"
                  className="form-control"
                  value={cost}
                  readOnly
                />
              </div>
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.checked)}
                />
                <label className="form-check-label">Pagado</label>
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              <button type="submit" className="btn btn-primary">Actualizar Cita</button>
            </form>
          )}
        </>
      ) : (
        <>
          <div className="card p-4 mb-4">
            <form onSubmit={handleCreateRecord}>
              <h4>Agendar Cita</h4>
              <div className="mb-3">
                <label className="form-label">Tratamiento:</label>
                <select
                  className="form-control"
                  value={treatment}
                  onChange={handleTreatmentChange}
                  required
                >
                  <option value="" disabled>Selecciona un tratamiento</option>
                  {treatmentOptions.map((option) => (
                    <option key={option.name} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Fecha:</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Costo:</label>
                <input
                  type="number"
                  className="form-control"
                  value={cost}
                  readOnly
                />
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              <button type="submit" className="btn btn-primary">Agendar Cita</button>
            </form>
          </div>
          <h3>Mis Citas</h3>
          <ul className="list-group">
            {records.map((record) => (
              <li key={record.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div className="d-flex flex-row align-items-center">
                <h5> <strong>Paciente:</strong> </h5>
                  <h5 className="me-3">{record.patient.firstName} {record.patient.lastName}</h5>
                  <h5> <strong>Tratamiento:</strong> </h5>
                  <h5 className="me-3">{record.treatment}</h5>
                  <h5> <strong>Fecha:</strong> </h5>
                  <h5 className="me-3">{new Date(record.date).toLocaleString()}</h5>
                  <h5> <strong>Costo:</strong> </h5>
                  <h5 className="me-3">${record.cost}</h5>
                  <h5 className={`badge ${record.paymentStatus ? 'bg-success' : 'bg-warning'}`}>
                    {record.paymentStatus ? 'Pagado' : 'No Pagado'}
                  </h5>
                </div>
                {isAdmin && (
                  <div>
                    <button className="btn btn-secondary me-2" onClick={() => handleEditRecord(record)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => handleDeleteRecord(record.id)}>Eliminar</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Records;
