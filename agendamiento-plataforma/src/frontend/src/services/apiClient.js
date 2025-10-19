import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export async function fetchAvailability(dateIso, ownerId = 1) {
  const { data } = await api.get('/appointments/availability', { params: { date: dateIso, ownerId } });
  return data;
}

export async function createAppointment(payload) {
  const { data } = await api.post('/appointments', payload, { headers: { 'x-api-key': import.meta.env.VITE_API_KEY || 'dev-key' } });
  return data;
}

export async function listAppointments(ownerId = 1) {
  const { data } = await api.get('/appointments', { params: { ownerId }, headers: { 'x-api-key': import.meta.env.VITE_API_KEY || 'dev-key' } });
  return data;
}

export async function deleteAppointment(id) {
  const { data } = await api.delete(`/appointments/${id}`, { headers: { 'x-api-key': import.meta.env.VITE_API_KEY || 'dev-key' } });
  return data;
}
