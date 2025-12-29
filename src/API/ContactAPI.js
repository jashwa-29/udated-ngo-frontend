import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const submitContactForm = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/contact/submit`, formData);
  return response.data;
};

export const fetchAllMessages = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/contact/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
};

export const updateMessageStatus = async (token, id, isRead) => {
  const response = await axios.put(
    `${API_BASE_URL}/contact/mark-read/${id}`,
    { isRead },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deleteContactMessage = async (token, id) => {
  const response = await axios.delete(`${API_BASE_URL}/contact/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
