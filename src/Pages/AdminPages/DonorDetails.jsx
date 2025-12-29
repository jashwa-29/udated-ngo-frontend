import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { fetchDonorDonationById } from "../../API/Admin API/donorApi";
import { useCurrency } from '../../context/CurrencyContext';

const DonorDetails = () => {
  const { convert } = useCurrency();
  const { id } = useParams();
  const navigate = useNavigate();
  const [donorData, setDonorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchDonorDonationById(id, user.token);
        console.log('Donor Data:', data);
        setDonorData(data);
      } catch (err) {
        console.error("Error fetching donor details:", err);
        setError("Failed to fetch donor details");
      } finally {
        setLoading(false);
      }
    };

    if (id && user?.token) fetchData();
  }, [id, user?.token]);

  if (loading) return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4D9186]"></div>
    </div>
  );

  if (error) return <div className="p-6 text-red-500">{error}</div>;

  if (!donorData) return (
    <div className="text-center text-gray-500 py-10">
      <div className="text-lg">Donor not found.</div>
    </div>
  );

  const donations = donorData.donations || [];

  return (
    <div className="p-6 bg-white min-h-screen space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-black font-medium hover:underline"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Donor Info */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-[#4D9186]">Donor Details</h2>
        <div className="bg-white rounded-md shadow border border-gray-300 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="text-gray-500 font-medium">Donor Name:</p>
            <p className="text-base font-semibold">{donorData.username}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Phone Number:</p>
            <p className="text-base font-semibold">{donorData.mobile}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Email:</p>
            <p className="text-base font-semibold">{donorData.email || donorData.mail}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Address:</p>
            <p className="text-base font-semibold">{donorData.address}</p>
          </div>
        </div>
      </section>

      {/* Donation History */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-[#4D9186]">Donation History</h2>
        {donations.length > 0 ? (
          <div className="flex flex-col gap-4">
            {donations.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow rounded-md p-4 border border-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm"
              >
                <div>
                  <p className="text-gray-500 font-medium">Patient Name:</p>
                  <p className="font-semibold">{item.requestId?.patientname || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Medical Problem:</p>
                  <p className="font-semibold">{item.requestId?.medicalproblem || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Donated Amount:</p>
                  <p className="font-semibold">{convert(item.amount)}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Donated On:</p>
                  <p className="font-semibold">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-gray-50 border border-dashed border-gray-300 rounded-md py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No donations yet</h3>
            <p className="mt-1 text-sm text-gray-500">This donor hasn't made any contributions yet.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DonorDetails;

