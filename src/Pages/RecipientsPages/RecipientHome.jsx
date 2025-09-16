import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipientsRequestForm from '../../Components/HomeComponents/RecipientsRequestForm';
import { getReceiverStatus } from '../../API/Receiver API/ReceiverStatus';

const RecipientHome = () => {
  const navigate = useNavigate();
  const [request, setRequest] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleViewDetails = (item) => {
    navigate(`/recipient/recipient-details/${item.id}`);
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getReceiverStatus(user.token, user.userId);
        console.log('Fetched request status:', data);
        setRequest(Array.isArray(data) ? data : [data]); // Ensure it's an array
      } catch (error) {
        console.error('Failed to fetch request status', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token && user?.userId) {
      fetchStatus();
    } else {
      setLoading(false);
    }
  }, []);

    const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };


  const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'accepted':
      return 'text-green-600';
    case 'waiting':
      return 'text-orange-500';
    case 'rejected':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};


 return (
  <section className='px-4 my-4'>
    {loading ? (
      <div className="text-center text-gray-500 py-10">Loading...</div>
    ) : request.length === 0 ? (
      <div className="text-center text-gray-500 py-10">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="text-lg">No Request had been made yet</div>
      </div>
    ) : (
      <div className='flex flex-wrap justify-center gap-4'>
        {request.filter(item => {
    const isRejected = item.adminapprovedstatus?.toLowerCase() === 'rejected';
    const requestedDate = new Date(item.requesteddate);
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    return !(isRejected && requestedDate < tenDaysAgo);
  })
  .slice()
  .reverse()
  .map((item, index) => (
          <div
            key={index}
            className='flex flex-col border border-gray-300 rounded-2xl p-8 w-[400px] gap-2 bg-white'
          >
            <h2 className='text-xl font-bold'>Hello 👋</h2>
            <p className='text-[19px]'>It’s good to see you again.</p>
            <p className='font-semibold text-lg'>
              Your Request Status:{' '}
              <span className={getStatusColor(item.adminapprovedstatus)}>
                {item.adminapprovedstatus}
              </span>
            </p>
            <p className='text-[19px]'>Submitted On: {formatDate(item.requesteddate)}</p>
            <button
              onClick={() => handleViewDetails(item)}
              className='bg-[#0B8B68] mt-4 text-white w-30 py-2 text-sm font-semibold rounded'
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    )}
  </section>
);

};

export default RecipientHome;
