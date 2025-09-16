import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const myDonation = async (token,donorId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/donor/GetMyDonations/${donorId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
    return response.data;
  } catch (error) {
    console.error('Error fetching donor donations:', error);
    throw error;
  }
};
