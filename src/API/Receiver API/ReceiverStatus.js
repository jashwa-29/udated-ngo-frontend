const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';

export const getReceiverStatus = async (token, id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/receiver/MyRequest/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Receiver status response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching receiver status:', error.response?.data || error.message);
    throw error; // Re-throw so the caller can handle it too
  }
};
export const getReceiverDonationStatus = async (token, id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/receiver/GetdonationStatus/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Receiver status response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching receiver status:', error.response?.data || error.message);
    throw error; // Re-throw so the caller can handle it too
  }
};

