import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { fetchDonorDonationById } from "../../API/Admin API/donorApi";
  import { useCurrency } from '../../context/CurrencyContext';

const DonorDetails = () => {
  const { convert } = useCurrency();
  const { id } = useParams();
  const navigate = useNavigate();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
      const data = await fetchDonorDonationById(id, user.token);
        setDonor(data);
    
      } catch (err) {
        console.error("Error fetching donor details:", err);
        setError("Failed to fetch donor details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4D9186]"></div>
        </div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!donor || donor.length === 0) return   <div className="text-center text-gray-500 py-10">
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
            <div className="text-lg">No Donation have been made yet.</div>
          </div>;

  const [firstDonation] = donor;

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
        <h2 className="text-lg font-semibold mb-4">Donor Details</h2>
        <div className="bg-white rounded-md shadow border border-gray-300 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="text-gray-500 font-medium">Donor Name:</p>
            <p className="text-base font-semibold">{firstDonation.user.username}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Phone Number:</p>
            <p className="text-base font-semibold">{firstDonation.user.mobile}</p>
          </div>
          <div>
            <p className="text-gray-500  font-medium">Email:</p>
            <p className="text-base font-semibold">{firstDonation.user.mail}</p>
          </div>
          <div>
            <p className="text-gray-500  font-medium">Address:</p>
            <p className="text-base font-semibold">{firstDonation.user.address}</p>
          </div>
        </div>
      </section>

      {/* Donation History */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Donation Details</h2>
        <div className="flex flex-col gap-4">
          {donor.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow rounded-md p-4 border border-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm"
            >
              <div>
                <p className="text-gray-500 font-medium">Patient Name:</p>
                <p className="font-semibold">{item.donationRequest.patientname}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Medical Problem:</p>
                <p className="font-semibold">{item.donationRequest.medicalproblem}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Donated Amount:</p>
                <p className="font-semibold">{convert(item.amount)}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Donated On:</p>
                <p className="font-semibold">{new Date(item.donatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DonorDetails;
