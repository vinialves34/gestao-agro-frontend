import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const ruralProducerApi = {
  getAll: (filters: string = '') => api.get('/rural_producers' + filters),
  getById: (id: number) => api.get(`/rural_producers/${id}`),
  create: (data: any) => api.post('/rural_producers', data),
  update: (id: number, data: any) => api.put(`/rural_producers/${id}`, data),
  delete: (id: number) => api.delete(`/rural_producers/${id}`),
};

export const propertyApi = {
  getAll: (filters: string = '') => api.get('/properties' + filters),
  getById: (id: number) => api.get(`/properties/${id}`),
  create: (data: any) => api.post('/properties', data),
  update: (id: number, data: any) => api.put(`/properties/${id}`, data),
  delete: (id: number) => api.delete(`/properties/${id}`),
};

export const herdApi = {
  getAll: (filters: string = '') => api.get('/herds' + filters),
  getById: (id: number) => api.get(`/herds/${id}`),
  create: (data: any) => api.post('/herds', data),
  update: (id: number, data: any) => api.put(`/herds/${id}`, data),
  delete: (id: number) => api.delete(`/herds/${id}`),
};

export const specieApi = {
  getAll: () => api.get('/species'),
  getById: (id: number) => api.get(`/species/${id}`),
};