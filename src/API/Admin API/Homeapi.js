import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchAllRecipients = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/admin/GetAllDonationRequest`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchAllDonors = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/admin/GetAllDonors`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
