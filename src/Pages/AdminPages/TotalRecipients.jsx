import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RecipientModal from './RecipientModal';
import { fetchAllRecipients } from '../../API/Admin API/recipientApi'; // Adjust path as needed
  import { useCurrency } from '../../context/CurrencyContext';

const RecipientTable = ({ title, filterdata }) => {
  const { convert } = useCurrency();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const loadRecipients = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchAllRecipients(user.token);
        setRecipients(data);
      } catch (err) {
        console.error('Error fetching donation requests:', err);
        setError('Failed to load recipients. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) loadRecipients();
  }, [user?.token]);

  // Filter recipients by status and targetamountstatus
  const filteredRecipients = recipients
    .filter((item) => item.adminapprovedstatus === 'accepted')
    .filter((item) => item.targetamountstatus === filterdata)
    .slice(0, 3);

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg mb-4">{title}</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-lg text-right text-black font-semibold hover:underline"
        >
          View all
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
           <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4D9186]"></div>
        </div>
        ) : error ? (
          <div className="text-center py-10 text-red-600">{error}</div>
        ) : filteredRecipients.length === 0 ? (
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
            <div className="text-lg">No recipients found in this category.</div>
          </div>
        ) : (
          filteredRecipients.map((item) => (
            <div
              key={item.id || item._id} // Use stable id if available
              className="flex justify-between lg:flex-row lg:flex-nowrap flex-col md:flex-wrap lg:gap-0 gap-5 items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <div>
                <p className="text-gray-500 text-sm">Patient Name:</p>
                <p className="text-[17px] font-semibold">{item.patientname}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Age:</p>
                <p className="text-[17px] font-semibold">{item.patientage}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Phone Number:</p>
                <p className="text-[17px] font-semibold">{item.patientnumber}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Medical Problem:</p>
                <p className="text-[17px] font-semibold">{item.medicalproblem}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Donation Amount:</p>
                <p className="text-[17px] font-semibold">{convert(item.donationamount)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Submitted On:</p>
                <p className="text-[17px] font-semibold">
                  {new Date(item.requesteddate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Status:</p>
                <p
                  className={`text-[17px] font-semibold ${
                    item.targetamountstatus === 'ongoing' ? 'text-yellow-500' : 'text-green-600'
                  }`}
                >
                  {item.targetamountstatus}
                </p>
              </div>
              <div>
                <Link
                  to={`/admin/recipient/${item.id || item._id}`}
                  className="bg-[#4D9186] text-white px-4 py-2 text-sm rounded"
                >
                  View Donation Details
                </Link>
              </div>
            </div>
          ))
        )}

        <RecipientModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`${title} - Full List`}
          filterdata={filterdata}
        />
      </div>
    </div>
  );
};

export default function RecipientsList() {
  return (
    <div className="p-8 bg-white min-h-screen">
      <RecipientTable title="Current Recipients" filterdata="ongoing" />
      <RecipientTable title="Past Recipients" filterdata="completed" />
    </div>
  );
}
