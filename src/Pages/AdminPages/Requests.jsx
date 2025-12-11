import React, { useEffect, useState } from 'react';
import RecipientModal from './RecipientModal';
import { Link } from 'react-router-dom';
import axios from 'axios';
import RequestModal from './RequestModal';
import { useCurrency } from '../../context/CurrencyContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Requests = () => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
   const { convert } = useCurrency();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/GetAllDonationRequest`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log(response.data);
        
        
        const formattedData = response.data.map(item => ({
          id: item.id,
          name: item.patientname || 'Not provided',
          age: item.patientage || '--',
          phone: item.patientnumber || 'Not provided',
          problem: item.medicalproblem || 'Not specified',
          amount:item.donationamount ,
          date: item.requesteddate ? new Date(item.requesteddate).toLocaleDateString() : 'Not specified',
          status: item.adminapprovedstatus?.toLowerCase() || 'pending',
          identificationProof: item.identificationproof,
          medicalReport: item.medicalreport,
          patientImg: item.patientimg
        }));
        
        setRecipients(formattedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching donation requests:', err);
        setError('Failed to load requests. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const pendingRequests = recipients.filter(item => item.status === 'waiting');
  const hasPendingRequests = pendingRequests.length > 0;
  console.log(pendingRequests);
  

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
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-12 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">All Requests</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-lg text-black font-semibold hover:underline"
        >
          View all
        </button>
      </div>

      {hasPendingRequests ? (
        <div className="space-y-4">
          {pendingRequests.slice(0, 9).map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row flex-wrap justify-between gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
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
                <p className="text-[17px] font-semibold" >{convert(item.amount)}</p>
              </div>
              <div className="min-w-[120px]">
                <p className="text-gray-500 text-sm">Submitted On:</p>
                <p className="text-[17px] font-semibold">{item.date}</p>
              </div>
              <div className="min-w-[100px]">
                <p className="text-gray-500 text-sm">Status:</p>
                <p className={`text-[17px] font-semibold ${
                  item.status === 'pending' ? 'text-yellow-500' : 
                  item.status === 'accepted' ? 'text-green-600' : 
                  'text-red-600'}`}>
                  {item.status}
                </p>
              </div>
              <div className="self-center">
                <Link
                  to={`/admin/request/${item.id}`}
                  state={{ recipientData: item }}
                  className="bg-[#4D9186] hover:bg-[#0a7a5d] text-white px-4 py-2 text-sm rounded transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No pending requests</h3>
          <p className="mt-1 text-gray-500">There are currently no pending donation requests.</p>
        </div>
      )}

      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="All Requests"
        recipients={recipients}
        filterdata={'waiting'}

      />
    </div>
  );
};

export default Requests;