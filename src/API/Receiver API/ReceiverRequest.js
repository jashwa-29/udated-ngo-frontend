// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const submitRecipientRequest = async (formData) => {
  const data = new FormData();
  
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      data.append(key, value);
    }
  });

  try {
    const response = await api.post('/receiver/RequestDonation', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Failed to submit request';
    throw new Error(errorMessage);
  }
};

export const checkReceiverAuth = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return !!(user?.token && user?.role === 'RECEIVER');
};