import api from './api';

const recordService = {
  getAllRecords: () => api.get('/records'),
  getRecordById: (id) => api.get(`/records/${id}`),
  getRecordsByPatientId: (patientId) => api.get(`/records/patient/${patientId}`),
  createRecord: (recordData) => api.post('/records', recordData),
  updateRecord: (id, recordData) => api.put(`/records/${id}`, recordData),
  deleteRecord: (id) => api.delete(`/records/${id}`),
};

export default recordService;
