import axios from 'axios';
 
 const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
 
 export const fetchAllRecipients = async (token) => {
   const response = await axios.get(`${API_BASE_URL}/admin/GetAllDonationRequest`, {
     headers: { Authorization: `Bearer ${token}` },
   });
   return response.data.data || response.data;
 };
 
 export const fetchAllReceivers = async (token) => {
   const response = await axios.get(`${API_BASE_URL}/admin/GetAllReceivers`, {
     headers: { Authorization: `Bearer ${token}` },
   });
   return response.data.data || response.data;
 };
 
 export const fetchSingleDonationByRecipientId = async (recipientId, token) => {
   const response = await axios.get(
     `${API_BASE_URL}/admin/GetSingleDonation/${recipientId}`,
     {
       headers: { Authorization: `Bearer ${token}` },
     }
   );
   return response.data.data || response.data;
 };
 
 export const fetchSingleDonationRequestId = async (id, token) => {
   const response = await axios.get(
     `${API_BASE_URL}/admin/GetSingleDonationRequest/${id}`,
     {
       headers: { Authorization: `Bearer ${token}` },
     }
   );
   return response.data.data || response.data;
 };
 
 
 export const editApproveStatus = async (id, newStatus, token) => {
   const response = await axios.put(
     `${API_BASE_URL}/admin/UpdateRequestStatus/${id}/${newStatus}`,
     {}, // empty body
     {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     }
   );
   return response.data.data || response.data;
 };