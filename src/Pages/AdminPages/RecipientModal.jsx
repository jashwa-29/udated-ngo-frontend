import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllRecipients } from "../../API/Admin API/recipientApi";
import { useCurrency } from "../../context/CurrencyContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RecipientModal = ({ isOpen, onClose, title, filterdata }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recipients, setRecipients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const { convert } = useCurrency();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchAllRecipients(user.token);
        // data should be an array [{}, {}]
        
        const formattedData = Array.isArray(data) ? data.map(item => ({
          id: item._id,
          name: item.patientname || 'Not provided',
          age: item.age || '--',
          phone: item.number || 'Not provided',
          problem: item.medicalproblem || 'Not specified',
          amount: item.donationamount ? convert(item.donationamount) : 'Not specified',
          rawAmount: item.donationamount,
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Not specified',
          status: item.status?.toLowerCase() || 'pending',
          identificationProof: item.identificationproof,
          medicalReport: item.medicalreport,
          patientImg: item.patientimg,
          userInfo: item.userId || {}
        })) : [];

        setRecipients(formattedData);
      } catch (error) {
        console.error('Error fetching donation requests:', error);
        setError('Failed to load requests. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOpen, user.token, convert]);

  if (!isOpen) return null;

  // Filter by status if filterdata is provided
  // Note: filterdata could be 'pending', 'approved', 'rejected'
  const filteredRecipients = recipients.filter(item => 
    filterdata ? item.status === filterdata.toLowerCase() : true
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredRecipients.length / itemsPerPage);
  const paginatedData = filteredRecipients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            {filterdata && <span className="text-sm font-medium text-[#4D9186] bg-[#4D9186]/10 px-3 py-1 rounded-full">{filterdata}</span>}
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-60">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4D9186]"></div>
              <p className="mt-4 text-gray-500 font-medium">Fetching details...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          ) : filteredRecipients.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">No records found</h3>
              <p className="mt-2 text-gray-500">
                {filterdata ? `There are no ${filterdata} requests at the moment.` : 'No donation requests available.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 flex-1">
                    <div>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Patient</p>
                      <p className="text-base font-bold text-gray-800 truncate">{item.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Age</p>
                      <p className="text-base font-semibold text-gray-700">{item.age}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Phone</p>
                      <p className="text-base font-semibold text-gray-700">{item.phone}</p>
                    </div>
                    <div className="md:col-span-1 lg:col-span-2">
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Problem</p>
                      <p className="text-base font-semibold text-gray-700 truncate">{item.problem}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Target</p>
                      <p className="text-base font-bold text-[#4D9186]">{item.amount}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Status</p>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        item.status === 'approved' ? 'bg-green-100 text-green-700' : 
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="md:border-l md:pl-6">
                    <Link
                      to={`/admin/request/${item.id}`}
                      state={{ 
                        recipientData: item,
                        userInfo: item.userInfo
                      }}
                      className="whitespace-nowrap bg-[#4D9186] hover:bg-[#0a7a5d] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all block text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && !isLoading && !error && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 font-medium">
              Showing <span className="text-gray-800">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-gray-800">{Math.min(currentPage * itemsPerPage, filteredRecipients.length)}</span> of <span className="text-gray-800">{filteredRecipients.length}</span> results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                      currentPage === i + 1 ? 'bg-[#4D9186] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientModal;