const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';

export const getReceiverStatus = async (token, id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/receiver/MyRequests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Return the data directly if it's already an array, or extract from response.data.data
    return response.data.data || (Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    console.error('Error fetching receiver status:', error.response?.data || error.message);
    throw error;
  }
};

export const getReceiverDonationStatus = async (token, id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/receiver/RequestDetails/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching receiver donation details:', error.response?.data || error.message);
    throw error;
  }
};

