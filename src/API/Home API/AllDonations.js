import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const fetchAllDonationcard = async () => {
  const response = await axios.get(`${API_BASE_URL}/Home/GetAcceptedRequest`);
  console.log('Response from fetchAllDonationcard:', response.data);
  
  return response.data;
};