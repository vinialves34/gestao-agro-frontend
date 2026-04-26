import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const ruralProducerApi = {
  getAll: () => api.get('/rural_producers'),
  getById: (id: number) => api.get(`/rural_producers/${id}`),
  create: (data: any) => api.post('/rural_producers', data),
  update: (id: number, data: any) => api.put(`/rural_producers/${id}`, data),
  delete: (id: number) => api.delete(`/rural_producers/${id}`),
};

export const propertyApi = {
  getAll: () => api.get('/properties'),
  getById: (id: number) => api.get(`/properties/${id}`),
  create: (data: any) => api.post('/properties', data),
  update: (id: number, data: any) => api.put(`/properties/${id}`, data),
  delete: (id: number) => api.delete(`/properties/${id}`),
};

export const herdApi = {
  getAll: () => api.get('/herds'),
  getById: (id: number) => api.get(`/herds/${id}`),
  create: (data: any) => api.post('/herds', data),
  update: (id: number, data: any) => api.put(`/herds/${id}`, data),
  delete: (id: number) => api.delete(`/herds/${id}`),
};

export const specieApi = {
  getAll: () => api.get('/species'),
  getById: (id: number) => api.get(`/species/${id}`),
};