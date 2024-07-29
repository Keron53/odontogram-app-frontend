import api from './api';

const odontogramService = {
  getAllOdontograms: () => api.get('/odontograms'),
  getOdontogramById: (id) => api.get(`/odontograms/${id}`),
  createOdontogram: (odontogramData) => api.post('/odontograms', odontogramData),
  updateOdontogram: (id, odontogramData) => api.put(`/odontograms/${id}`, odontogramData),
  deleteOdontogram: (id) => api.delete(`/odontograms/${id}`),
  getOdontogramsByPatientId: (patientId) => api.get(`/odontograms/patient/${patientId}`)
};

export default odontogramService;
