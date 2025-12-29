import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchAllDonations = async () => {
    // We'll need a backend route for fetching ALL donations regardless of request
    // For now, if it doesn't exist, we'll suggest adding it or use a workaround.
    // I'll assume we want an endpoint like /admin/GetAllDonations
    const response = await axios.get(`${API_BASE_URL}/admin/GetAllDonations`, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}` }
    });
    return response.data.data;
};

export const fetchRequestDonations = async (requestId) => {
    const response = await axios.get(`${API_BASE_URL}/admin/GetRequestDonations/${requestId}`, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}` }
    });
    return response.data.data;
};
