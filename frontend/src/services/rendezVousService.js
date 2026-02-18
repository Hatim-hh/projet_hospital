import api from './api';

export const rendezVousService = {
  getAll: (params = {}) => api.get('/rendez-vous', { params }),
  getById: (id) => api.get(`/rendez-vous/${id}`),
  create: (data) => api.post('/rendez-vous', data),
  update: (id, data) => api.put(`/rendez-vous/${id}`, data),
  delete: (id) => api.delete(`/rendez-vous/${id}`)
};
