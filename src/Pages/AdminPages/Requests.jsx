import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import RequestModal from './RequestModal';
import { useCurrency } from '../../context/CurrencyContext';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DeleteConfirmationModal from '../../Components/CommonComponents/DeleteConfirmationModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Requests = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFilter, setModalFilter] = useState("pending");
  const [recipients, setRecipients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const { convert } = useCurrency();

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({ 
    isOpen: false, 
    id: null, 
    isLoading: false 
  });

  // Helper to open modal with specific filter
  const openRequestsModal = (filter = null) => {
    setModalFilter(filter);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    setDeleteModal({ isOpen: true, id: id, isLoading: false });
  };

  const confirmDelete = async () => {
    const id = deleteModal.id;
    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      await axios.delete(`${API_BASE_URL}/admin/deleteDonationRequest/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success('Donation request deleted successfully');
      setRecipients(prev => prev.filter(item => item.id !== id));
      setDeleteModal({ isOpen: false, id: null, isLoading: false });
    } catch (err) {
      console.error('Error deleting donation request:', err);
      toast.error(err.response?.data?.message || 'Failed to delete donation request');
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/GetAllDonationRequest`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log('API Response:', response.data);
        
        // Backend returns { data: [], pagination: {} }
        const responseData = response.data.data || [];
        
        // Map backend fields to frontend expected fields
        const formattedData = responseData.map(item => ({
          id: item._id,
          name: item.patientname,
          age: item.age,
          phone: item.number,
          problem: item.medicalproblem,
          amount: item.donationamount,
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Not specified',
          status: item.status || 'pending',
          identificationProof: item.identificationproof,
          medicalReport: item.medicalreport,
          otherProof: item.otherproof,
          userId: item.userId?._id || item.userId,
          userInfo: item.userId || {}
        }));
        
        console.log('Formatted Data:', formattedData);
        setRecipients(formattedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching donation requests:', err);
        if (err.response) {
          setError(`Error ${err.response.status}: ${err.response.data.message || 'Failed to load requests'}`);
        } else if (err.request) {
          setError('Network error. Please check your connection.');
        } else {
          setError('Failed to load requests. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.token) {
      fetchData();
    } else {
      setError('User not authenticated. Please login again.');
      setIsLoading(false);
    }
  }, [user]);

  // Filter pending requests
  const pendingRequests = recipients.filter(item => item.status === 'pending');
  const hasPendingRequests = pendingRequests.length > 0;

  if (isLoading) {
    return (
      <div className="my-12 px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">All Requests</h2>
          <button className="text-lg text-black font-semibold hover:underline" disabled>
            View all
          </button>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4D9186]"></div>
          <p className="ml-4 text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-12 px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">All Requests</h2>
          <button className="text-lg text-black font-semibold hover:underline" disabled>
            View all
          </button>
        </div>
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 mt-16 md:mt-0">
        <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
          Recent <span className="text-[#4D9186]">Requests</span>
          <span className="ml-3 text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
            {pendingRequests.length} Pending
          </span>
        </h2>
        <button
          onClick={() => openRequestsModal(null)}
          className="text-sm font-bold text-[#4D9186] hover:underline flex items-center gap-1"
        >
          View Database
        </button>
      </div>

      {hasPendingRequests ? (
        <div className="space-y-4">
          {pendingRequests.slice(0, 9).map((item, index) => (
            <div
              key={item.id || index}
              className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#4D9186]/20 transition-all duration-300"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Patient</p>
                  <p className="text-gray-900 font-black tracking-tight truncate">{item.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Age/Phone</p>
                  <p className="text-gray-900 font-bold text-sm">{item.age}Y • {item.phone}</p>
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Condition</p>
                  <p className="text-gray-600 font-bold text-sm truncate">{item.problem || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Goal</p>
                  <p className="text-[#4D9186] font-black">{convert(item.amount || '0')}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Date</p>
                  <p className="text-gray-500 font-bold text-sm">{item.date}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Status</p>
                  <div className={`text-[10px] font-black uppercase inline-flex items-center gap-1.5`}>
                    <span className={`w-2 h-2 rounded-full ${
                      item.status === 'pending' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 
                      item.status === 'approved' ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]' : 
                      item.status === 'achieved' ? 'bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.5)]' : 
                      'bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]'}`} />
                    <span className={
                      item.status === 'pending' ? 'text-amber-500' : 
                      item.status === 'approved' ? 'text-blue-600' : 
                      item.status === 'achieved' ? 'text-emerald-600' : 
                      'text-red-600'
                    }>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 lg:justify-end">
                  <Link
                    to={`/admin/request/${item.id}`}
                    className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#4D9186] transition-all shadow-md active:scale-95"
                  >
                    Details
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors border border-red-100"
                    title="Delete Request"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {pendingRequests.length > 9 && (
            <div className="text-center mt-4">
              <p className="text-gray-500">
                Showing 9 of {pendingRequests.length} pending requests. 
                <button 
                  onClick={() => openRequestsModal("pending")}
                  className="ml-2 text-[#4D9186] font-semibold hover:underline"
                >
                  View all pending
                </button>
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No pending requests</h3>
          <p className="mt-1 text-gray-500">
            {recipients.length === 0 
              ? "No donation requests found." 
              : "There are currently no pending donation requests."}
          </p>
          {recipients.length > 0 && (
            <button
              onClick={() => openRequestsModal(null)}
              className="mt-4 bg-[#4D9186] hover:bg-[#0a7a5d] text-white px-4 py-2 rounded transition-colors"
            >
              View approved {recipients.length} Requests
            </button>
          )}
        </div>
      )}

      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalFilter ? `${modalFilter.charAt(0).toUpperCase() + modalFilter.slice(1)} Requests` : "All Donation Requests"}
        recipients={recipients}
        filterData={modalFilter}
        onDelete={handleDelete}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        isLoading={deleteModal.isLoading}
        onClose={() => setDeleteModal({ isOpen: false, id: null, isLoading: false })}
        onConfirm={confirmDelete}
        title="Delete Request"
        message="Are you sure you want to delete this donation request? This will permanently remove the case and all associated data."
      />
    </div>
  );
};

export default Requests;