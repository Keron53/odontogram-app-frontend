import React, { useState, useEffect } from 'react';
import recordService from '../services/recordService';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import '../styles/Factures.css';

const Factures = () => {
  const [records, setRecords] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const handleGenerateInvoice = (record) => {
    const doc = new jsPDF();

    doc.text(`Factura para ${record.treatment}`, 20, 10);
    doc.autoTable({
      startY: 20,
      head: [['Campo', 'Detalle']],
      body: [
        ['Tratamiento', record.treatment],
        ['Fecha', new Date(record.date).toLocaleString()],
        ['Costo', `$${record.cost}`],
        ['Estado de Pago', record.paymentStatus ? 'Pagado' : 'No Pagado'],
      ],
    });

    doc.save(`Factura-${record.treatment}-${record.id}.pdf`);
  };

  if (!isAuthenticated) {
    return <div className="alert alert-warning">Ingresa sesión para generar facturas.</div>;
  }

  return (
    <div className="factures-container">
      <h1>{isAdmin ? 'Todas las Citas' : 'Mis Citas'}</h1>
      <div className="records-list">
        {records.map((record) => (
          <div className="record-item" key={record.id}>
            <h3>{record.treatment}</h3>
            <p><strong>A nombre de: </strong>{record.patient.firstName} {record.patient.lastName}</p>
            <p><strong>Fecha:</strong> {new Date(record.date).toLocaleString()}</p>
            <p><strong>Costo:</strong> ${record.cost}</p>
            <p className={`status ${record.paymentStatus ? '' : 'unpaid'}`}>
              {record.paymentStatus ? 'Pagado' : 'No Pagado'}
            </p>
            <button onClick={() => handleGenerateInvoice(record)} className="btn btn-primary">
              Generar Factura
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Factures;
