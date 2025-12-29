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
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (error) {
      console.error('Error reading user token:', error);
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
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    
    const user = JSON.parse(userStr);
    
    // Check if user has token AND role is RECEIVER
    return !!(user?.token && user?.role === 'RECEIVER');
  } catch (error) {
    console.error('Error checking receiver auth:', error);
    return false;
  }
};