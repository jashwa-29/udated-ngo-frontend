import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllRecipients, fetchAllDonors } from '../../API/Admin API/Homeapi'; // Adjust path as needed

const AdminHome = () => {
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState([]);
  const [donors, setDonors] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipientsData, donorsData] = await Promise.all([
          fetchAllRecipients(user.token),
          fetchAllDonors(user.token),
        ]);
        console.log('Fetched recipients:', recipientsData);
        setRecipients(recipientsData);
        setDonors(donorsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (user?.token) fetchData();
  }, [user?.token]);

  return (
    <section className='mt-8 p-6'>
      <div className='flex justify-evenly flex-wrap lg:gap-0 gap-4'>
        <div className='lg:w-[48%] w-full border border-gray-200 p-7 rounded-2xl shadow-2xl bg-white flex flex-col gap-3'>
          <h2 className='text-2xl font-semibold'>Total Recipients ({recipients.filter(r => r.adminapprovedstatus === 'accepted').length})</h2>
          <p className='text-lg text-gray-800'>
            The total number of individuals we are currently supporting through our platform.
          </p>
          <button
            className='text-base bg-[#4D9186] text-white px-5 py-2 rounded'
            onClick={() => navigate('/admin/total-recipients')}
          >
            View Details
          </button>
        </div>
        <div className='lg:w-[48%] w-full border border-gray-200 p-7 rounded-2xl shadow-2xl bg-white flex flex-col gap-3'>
          <h2 className='text-2xl font-semibold'>Total Donors ({donors.length})</h2>
          <p className='text-lg text-gray-800'>
            The total number of individuals who have contributed to our mission.
          </p>
          <button
            className='text-base bg-[#4D9186] text-white px-5 py-2 rounded'
            onClick={() => navigate('/admin/total-donors')}
          >
            View Details
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdminHome;
