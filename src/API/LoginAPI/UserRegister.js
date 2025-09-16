const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';

export const userRegister = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Register` , data);
    // console.log('Receiver status response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching receiver status:', error.response?.data || error.message);
    throw error; // Re-throw so the caller can handle it too
  }
};