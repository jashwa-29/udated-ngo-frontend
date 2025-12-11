const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';

export const ForgotPassword = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin-forgot-password`, data);
    // console.log('Forgot Password response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error in Forgot Password:', error.response?.data || error.message);
    throw error; // Re-throw for caller to handle
  }
};
