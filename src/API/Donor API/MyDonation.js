import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const myDonation = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/donor/MyDonations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching donor donations:', error);
    throw error;
  }
};
