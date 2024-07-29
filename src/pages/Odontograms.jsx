import React, { useEffect, useState } from 'react';
import odontogramService from '../services/odontogramService';
import patientService from '../services/patientService';
import '../styles/Odontogram.css';

const toothNumbers = [
  18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
  38, 37, 36, 35, 34, 33, 32, 31, 41, 42, 43, 44, 45, 46, 47, 48
];

const toothTypes = {
  canino: [13, 23, 33, 43],
  incisivo: [11, 12, 21, 22, 31, 32, 41, 42],
  molar: [16, 17, 18, 26, 27, 28, 36, 37, 38, 46, 47, 48],
  premolar: [14, 15, 24, 25, 34, 35, 44, 45]
};

const Odontogram = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [toothNumber, setToothNumber] = useState('');
  const [condition, setCondition] = useState('');
  const [treatment, setTreatment] = useState('');
  const [error, setError] = useState('');
  const [odontograms, setOdontograms] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    if (token) {
      setIsAuthenticated(true);
      if (role === 'admin') {
        setIsAdmin(true);
        fetchPatients();
      } else {
        setSelectedPatientId(userId);
        fetchPatientOdontograms(userId);
      }
    }
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await patientService.getAllPatients();
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchPatientOdontograms = async (patientId) => {
    try {
      const response = await odontogramService.getOdontogramsByPatientId(patientId);
      setOdontograms(response.data);
    } catch (error) {
      console.error('Error fetching patient odontograms:', error);
    }
  };

  const handleCreateOrUpdateOdontogram = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const existingOdontogram = odontograms.find(
        (o) => o.toothNumber === toothNumber
      );

      if (existingOdontogram) {
        await odontogramService.updateOdontogram(existingOdontogram.id, {
          patient: { id: selectedPatientId },
          toothNumber,
          condition,
          treatment,
        });
        alert('Odontograma actualizado con éxito');
      } else {
        await odontogramService.createOdontogram({
          patient: { id: selectedPatientId },
          toothNumber,
          condition,
          treatment,
        });
        alert('Odontograma creado con éxito');
      }

      fetchPatientOdontograms(selectedPatientId);
    } catch (err) {
      console.error('Error al crear o actualizar el odontograma:', err);
      setError('Error al crear o actualizar el odontograma. Intente nuevamente.');
    }
  };

  const handleDeleteTooth = async (toothId) => {
    try {
      await odontogramService.deleteOdontogram(toothId);
      alert('Diente eliminado con éxito');
      fetchPatientOdontograms(selectedPatientId);
    } catch (err) {
      console.error('Error al eliminar el diente:', err);
      setError('Error al eliminar el diente. Intente nuevamente.');
    }
  };

  const getToothImage = (number, condition) => {
    let toothType = 'default';
    if (toothTypes.canino.includes(number)) toothType = 'canino';
    else if (toothTypes.incisivo.includes(number)) toothType = 'incisivo';
    else if (toothTypes.molar.includes(number)) toothType = 'molar';
    else if (toothTypes.premolar.includes(number)) toothType = 'premolar';

    const conditionType = condition !== 'normal' ? `_${condition}` : '';
    return `/images/${toothType}${conditionType}.png`;
  };

  const generateOdontogramView = () => {
    const upperTeeth = toothNumbers.slice(0, 16);
    const lowerTeeth = toothNumbers.slice(16, 32);

    const renderTeeth = (teeth) => teeth.map((num) => {
      const tooth = odontograms.find(o => parseInt(o.toothNumber) === num);
      const condition = tooth ? tooth.condition : 'normal';
      return (
        <div className="tooth-container" key={num}>
          <div className="tooth-number">{num}</div>
          <img
            src={getToothImage(num, condition)}
            alt={`Diente ${num}`}
            className="tooth"
          />
        </div>
      );
    });

    return (
      <div className="mouth">
        <div className="teeth-row">{renderTeeth(upperTeeth)}</div>
        <div className="teeth-row">{renderTeeth(lowerTeeth)}</div>
      </div>
    );
  };

  const renderToothDetails = () => (
    <div className="tooth-details">
      <h2>Detalles de los Dientes</h2>
      <div className="tooth-cards">
        {odontograms.map((tooth) => (
          <div key={tooth.id} className="tooth-card">
            <h3>Diente {tooth.toothNumber}</h3>
            <p><strong>Condición:</strong> {tooth.condition}</p>
            <p><strong>Tratamiento:</strong> {tooth.treatment}</p>
            {isAdmin && (
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteTooth(tooth.id)}
              >
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return <div className="alert alert-warning">Debes loguearte para ver los Odontogramas.</div>;
  }

  if (!isAdmin) {
    return (
      <div className="odontogram-container">
        <h2>Odontograma</h2>
        <div className="odontogram-view">
          {generateOdontogramView()}
        </div>
        {renderToothDetails()}
      </div>
    );
  }

  return (
    <div className="odontogram-container">
      <div className="form-container">
        <h1>Actualizar Odontograma</h1>
        <form onSubmit={handleCreateOrUpdateOdontogram} className="odontogram-form">
          <div className="form-group">
            <label>Paciente:</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              required
            >
              <option value="" disabled>Selecciona un paciente</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Número de Diente:</label>
            <select
              value={toothNumber}
              onChange={(e) => setToothNumber(e.target.value)}
              required
            >
              <option value="" disabled>Selecciona el número de diente</option>
              {toothNumbers.map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Estado del Diente:</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
            >
              <option value="" disabled>Selecciona el estado del diente</option>
              {['normal', 'fracturado', 'caries', 'discromia'].map((cond) => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Tratamiento:</label>
            <input
              type="text"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              required
              className="treatment-input"
            />
          </div>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <button type="submit" className="btn btn-primary">Crear/Actualizar</button>
        </form>
      </div>

      <div className="odontogram-view-container">
        <h2>Odontograma</h2>
        <div className="form-group">
          <label>Paciente:</label>
          <select
            value={selectedPatientId}
            onChange={(e) => {
              setSelectedPatientId(e.target.value);
              fetchPatientOdontograms(e.target.value);
            }}
            required
          >
            <option value="" disabled>Selecciona un paciente</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="odontogram-view">
          {generateOdontogramView()}
        </div>
        {renderToothDetails()}
      </div>
    </div>
  );
};

export default Odontogram;
