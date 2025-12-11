import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllRecipients } from "../../API/Admin API/recipientApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RecipientModal = ({ isOpen, onClose, title, filterdata }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recipients, setRecipients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  const user = JSON.parse(localStorage.getItem("user"));

  

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchAllRecipients(user.token);

        const formattedData = data.map(item => ({
          id: item.id,
          name: item.patientname || 'Not provided',
          age: item.patientage || '--',
          phone: item.patientnumber || 'Not provided',
          problem: item.medicalproblem || 'Not specified',
          amount: item.donationamount ? `$${Number(item.donationamount).toLocaleString()}` : 'Not specified',
          date: item.requesteddate ? new Date(item.requesteddate).toLocaleDateString() : 'Not specified',
          status: item.targetamountstatus?.toLowerCase() || 'pending',
          identificationProof: item.identificationproof,
          medicalReport: item.medicalreport,
          patientImg: item.patientimg
        }));

        setRecipients(formattedData);
      } catch (error) {
        console.error('Error fetching donation requests:', error);
        setError('Failed to load requests. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOpen, user.token]);

  if (!isOpen) return null;

  // Filter by status
  const filteredRecipients = recipients.filter(item => 
    filterdata ? item.status === filterdata : true
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
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4D9186]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        ) : filteredRecipients.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No requests found</h3>
            <p className="mt-1 text-gray-500">
              {filterdata ? `There are no ${filterdata} requests.` : 'There are no requests available.'}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedData.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row flex-wrap justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="min-w-[150px]">
                    <p className="text-gray-500 text-sm">Patient Name:</p>
                    <p className="text-[17px] font-semibold">{item.name}</p>
                  </div>
                  <div className="min-w-[80px]">
                    <p className="text-gray-500 text-sm">Age:</p>
                    <p className="text-[17px] font-semibold">{item.age}</p>
                  </div>
                  <div className="min-w-[120px]">
                    <p className="text-gray-500 text-sm">Phone:</p>
                    <p className="text-[17px] font-semibold">{item.phone}</p>
                  </div>
                  <div className="min-w-[180px]">
                    <p className="text-gray-500 text-sm">Medical Problem:</p>
                    <p className="text-[17px] font-semibold">{item.problem}</p>
                  </div>
                  <div className="min-w-[120px]">
                    <p className="text-gray-500 text-sm">Amount Needed:</p>
                    <p className="text-[17px] font-semibold">{item.amount}</p>
                  </div>
                  <div className="min-w-[120px]">
                    <p className="text-gray-500 text-sm">Submitted On:</p>
                    <p className="text-[17px] font-semibold">{item.date}</p>
                  </div>
                  <div className="min-w-[100px]">
                    <p className="text-gray-500 text-sm">Status:</p>
                    <p className={`text-[17px] font-semibold ${
                      item.status === 'ongoing' ? 'text-yellow-500' : 
                      item.status === 'completed' ? 'text-green-600' : 
                      'text-gray-600'}`}>
                      {item.status}
                    </p>
                  </div>
                  <div className="self-center">
                    <Link
                      to={`/admin/recipient/${item.id}`}
                      state={{ recipientData: item }}
                      className="bg-[#4D9186] hover:bg-[#0a7a5d] text-white px-4 py-2 text-sm rounded transition-colors"
                    >
                      View Donation Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecipientModal;