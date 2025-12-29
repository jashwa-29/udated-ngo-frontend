import axios from 'axios';
 
 const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
 
 export const fetchAllDonors = async (token) => {
   const response = await axios.get(`${API_BASE_URL}/admin/GetAllDonors`, {
     headers: { Authorization: `Bearer ${token}` },
   });
   return response.data.data || response.data;
 };
 
 
 export const fetchDonorDonationById = async (id, token) => {
   const response = await axios.get(`${API_BASE_URL}/admin/GetDonorDonation/${id}`, {
     headers: { Authorization: `Bearer ${token}` },
   });
   return response.data.data || response.data;
 };

