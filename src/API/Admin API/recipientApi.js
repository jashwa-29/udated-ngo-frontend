import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchAllRecipients = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/admin/GetAllDonationRequest`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('Fetched all recipients:', response.data);
  
  return response.data;
};

export const fetchSingleDonationByRecipientId = async (recipientId, token) => {
  const response = await axios.get(
    `${API_BASE_URL}/admin/GetSingleDonation/${recipientId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
 
  console.log(response.data);
  return response.data;
};
export const fetchSingleDonationRequestId = async (recipientId, token) => {
  const response = await axios.get(
    `${API_BASE_URL}/admin/GetSingleDonationRequest/${recipientId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
 
  console.log(response.data);
  return response.data;
};


export const editApproveStatus = async (recipientId, newStatus, token) => {


  const response = await axios.put(
    `${API_BASE_URL}/admin/UpdateRequestStatus/${recipientId}/${newStatus}`,
    {}, // empty body
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};