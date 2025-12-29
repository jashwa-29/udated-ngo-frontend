import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCurrency } from '../../context/CurrencyContext';
import { Trash2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DeleteConfirmationModal from "../../Components/CommonComponents/DeleteConfirmationModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RequestModal = ({ isOpen, onClose, title, recipients, filterData, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredRecipients, setFilteredRecipients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  const user = JSON.parse(localStorage.getItem("user"));
  const { convert } = useCurrency();

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({ 
    isOpen: false, 
    id: null, 
    isLoading: false 
  });

  useEffect(() => {
    if (!isOpen) {
      setCurrentPage(1);
      return;
    }

    if (recipients && recipients.length > 0) {
      // Filter recipients based on filterData
      let filtered = recipients;
      if (filterData) {
        filtered = recipients.filter(item => item.status === filterData);
      }
      setFilteredRecipients(filtered);
      setIsLoading(false);
    } else {
      // If no recipients passed, fetch them
      fetchData();
    }
  }, [isOpen, recipients, filterData]);

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
      
      // Update local state
      setFilteredRecipients(prev => prev.filter(item => item.id !== id));
      
      // Update parent state via callback if provided
      if (onDelete) {
        onDelete(id);
      }
      setDeleteModal({ isOpen: false, id: null, isLoading: false });
    } catch (err) {
      console.error('Error deleting donation request in modal:', err);
      toast.error(err.response?.data?.message || 'Failed to delete donation request');
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const fetchData = async () => {
    if (!user || !user.token) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/GetAllDonationRequest`, {
        headers: { 
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
      });
      
      console.log('Modal API Response:', response.data);
      
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

      // Apply filter if specified
      let filtered = formattedData;
      if (filterData) {
        filtered = formattedData.filter(item => item.status === filterData);
      }
      
      setFilteredRecipients(filtered);
    } catch (error) {
      console.error('Error fetching donation requests in modal:', error);
      if (error.response) {
        setError(`Error ${error.response.status}: ${error.response.data.message || 'Failed to load requests'}`);
      } else if (error.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('Failed to load requests. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredRecipients.length / itemsPerPage));
  const paginatedData = filteredRecipients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  
  const handlePageClick = (page) => setCurrentPage(page);

  // Function to get status display text and color
  const getStatusInfo = (status) => {
    switch(status) {
      case 'pending':
        return { text: 'Pending', color: 'text-amber-600', bgColor: 'bg-amber-50' };
      case 'approved':
        return { text: 'Approved', color: 'text-blue-600', bgColor: 'bg-blue-50' };
      case 'achieved':
        return { text: 'Achieved', color: 'text-emerald-600', bgColor: 'bg-emerald-50' };
      case 'rejected':
        return { text: 'Rejected', color: 'text-red-600', bgColor: 'bg-red-50' };
      default:
        return { text: status, color: 'text-gray-600', bgColor: 'bg-gray-50' };
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {filteredRecipients.length} request{filteredRecipients.length !== 1 ? 's' : ''} found
              {filterData && ` • Filtered by: ${filterData}`}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4D9186]"></div>
              <p className="mt-4 text-gray-600">Loading requests...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
              <button 
                onClick={fetchData}
                className="mt-2 text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredRecipients.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No requests found</h3>
              <p className="mt-1 text-gray-500 mb-4">
                {filterData 
                  ? `There are no ${filterData} requests.` 
                  : 'There are no donation requests available.'}
              </p>
              {filterData && (
                <button
                  onClick={() => window.location.reload()}
                  className="text-[#4D9186] hover:text-[#0a7a5d] font-medium"
                >
                  Clear filter and view all
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Table View for Larger Screens */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medical Problem</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.map((item, index) => {
                      const statusInfo = getStatusInfo(item.status);
                      return (
                        <tr key={item.id || index} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{item.name}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.age}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.phone}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 truncate max-w-xs">{item.problem || 'Not specified'}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">{convert(item.amount || '0')}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.date}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                              {statusInfo.text}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/admin/request/${item.id}`}
                                state={{ 
                                  recipientData: item,
                                  userInfo: item.userInfo
                                }}
                                className="bg-[#4D9186] hover:bg-[#0a7a5d] text-white px-3 py-1.5 text-xs rounded transition-colors inline-block"
                              >
                                View Details
                              </Link>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                title="Delete Request"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Card View for Mobile */}
              <div className="md:hidden space-y-4">
                {paginatedData.map((item, index) => {
                  const statusInfo = getStatusInfo(item.status);
                  return (
                    <div
                      key={item.id || index}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                    >
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-gray-500 text-xs">Patient Name</p>
                          <p className="font-semibold text-sm">{item.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Age</p>
                          <p className="font-semibold text-sm">{item.age}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Phone</p>
                          <p className="font-semibold text-sm">{item.phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Status</p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                            {statusInfo.text}
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="text-gray-500 text-xs">Medical Problem</p>
                        <p className="font-semibold text-sm">{item.problem || 'Not specified'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <p className="text-gray-500 text-xs">Amount Needed</p>
                          <p className="font-semibold text-sm">{convert(item.amount || '0')}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Submitted On</p>
                          <p className="font-semibold text-sm">{item.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/request/${item.id}`}
                          state={{ 
                            recipientData: item,
                            userInfo: item.userInfo
                          }}
                          className="flex-1 bg-[#4D9186] hover:bg-[#0a7a5d] text-white px-4 py-2 text-sm rounded transition-colors text-center block"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-3 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors border border-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Pagination Controls */}
        {!isLoading && !error && filteredRecipients.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="mb-4 sm:mb-0">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredRecipients.length)}
                  </span> of{" "}
                  <span className="font-medium">{filteredRecipients.length}</span> results
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200 transition-colors disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageClick(pageNum)}
                        className={`w-8 h-8 text-sm rounded ${
                          currentPage === pageNum
                            ? 'bg-[#4D9186] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } transition-colors`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="px-1">...</span>
                      <button
                        onClick={() => handlePageClick(totalPages)}
                        className={`w-8 h-8 text-sm rounded ${
                          currentPage === totalPages
                            ? 'bg-[#4D9186] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } transition-colors`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
                
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200 transition-colors disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          isLoading={deleteModal.isLoading}
          onClose={() => setDeleteModal({ isOpen: false, id: null, isLoading: false })}
          onConfirm={confirmDelete}
          title="Delete Donation Request"
          message="Are you sure you want to delete this case? This will permanently remove the data and cannot be undone."
        />
      </div>
    </div>
  );
};

export default RequestModal;