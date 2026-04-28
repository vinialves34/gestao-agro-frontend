import axios from 'axios';
import type { RuralProducer } from '../models/RuralProducer';
import type { Property } from '../models/Property';
import type { Herd } from '../models/Herd';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const ruralProducerApi = {
  getAll: (filterParams = {}) => api.get('/rural-producers', { params: filterParams }),
  getById: (id: number) => api.get(`/rural-producers/${id}`),
  create: (data: RuralProducer) => api.post('/rural-producers', data),
  update: (id: number, data: any) => api.put(`/rural-producers/${id}`, data),
  delete: (id: number) => api.delete(`/rural-producers/${id}`),
};

export const propertyApi = {
  getAll: (filtersParams = {}) => api.get('/properties', { params: filtersParams }),
  getById: (id: number) => api.get(`/properties/${id}`),
  create: (data: Property) => api.post('/properties', data),
  update: (id: number, data: any) => api.put(`/properties/${id}`, data),
  delete: (id: number) => api.delete(`/properties/${id}`),
};

export const herdApi = {
  getAll: (filtersParams = {}) => api.get('/herds', { params: filtersParams }),
  getById: (id: number) => api.get(`/herds/${id}`),
  create: (data: Herd) => api.post('/herds', data),
  update: (id: number, data: any) => api.put(`/herds/${id}`, data),
  delete: (id: number) => api.delete(`/herds/${id}`),
};

export const specieApi = {
  getAll: () => api.get('/species'),
  getById: (id: number) => api.get(`/species/${id}`),
};

export const reportApi = {
  getTotalHerdsBySpecies: () => api.get('/report/total/herds-by-specie'),
  getTotalPropertiesByCity: () => api.get('/report/total/properties-by-city'),
}