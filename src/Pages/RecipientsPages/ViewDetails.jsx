import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getReceiverDonationStatus } from '../../API/Receiver API/ReceiverStatus';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useCurrency } from '../../context/CurrencyContext';

const RecipientDetails = () => {
    const { convert } = useCurrency();
  const [donations, setDonations] = useState([]);
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'accept' or 'reject'
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchRecipientData = async () => {
      try {
        setLoading(true);
        const data = await getReceiverDonationStatus( user.token  , id,);

        if (!Array.isArray(data)) {
          throw new Error("Invalid response format");
        }

   if (!Array.isArray(data) || data.length === 0) {
  throw new Error("No donations have been made yet.");
}

const firstDonation = data[0];

if (!firstDonation.donationRequest) {
  throw new Error("No recipient data found for the first donation.");
}
        const totalDonations = data.reduce((sum, donation) => sum + (donation.amount || 0), 0);

        setDonations(data);
        setRecipientInfo({
          ...firstDonation.donationRequest,
          raisedAmount: totalDonations,
          progressPercentage: firstDonation.donationRequest.donationamount
            ? Math.min(
                Math.round((totalDonations / firstDonation.donationRequest.donationamount) * 100),
                100
              )
            : 0,
        });
      } catch (err) {
        setError(err.message || "Failed to fetch recipient data");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipientData();
  }, [id, user.token]);



  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹ 0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) return <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B8B68]"></div>
        </div>;
 if (error) {
  return (
    <div className="p-8 text-red-500">
      {error === "No donations have been made yet." ? (
        <div className="text-center text-gray-500 py-10">
            <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-4 gap-2 text-sm text-black font-medium hover:underline"
      >
        <ArrowLeft size={16} />
        Back
      </button>
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
        </div>
      ) : (
        `Error: ${error}`
      )}
    </div>
  );
}

  if (!recipientInfo) return <div className="p-8">No recipient found for ID {id}.</div>;

  return (
    <div className="p-8 bg-[#f9f9f9] min-h-screen font-sans">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-4 gap-2 text-sm text-black font-medium hover:underline"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <h2 className="text-xl font-bold mb-2">Recipient</h2>

      {/* Recipient Info */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex justify-between lg:flex-row lg:flex-nowrap flex-col md:flex-wrap lg:gap-0 gap-5 items-center text-sm">
          {[
            { label: "Patient Name", value: recipientInfo.patientname },
            { label: "Age", value: recipientInfo.patientage },
            { label: "Gender", value: recipientInfo.patientgender },
            { label: "Phone Number", value: recipientInfo.patientnumber },
            { label: "Medical Problem", value: recipientInfo.medicalproblem },
            { label: "Donation Amount", value: convert(recipientInfo.donationamount) },
            {
              label: "Status",
              value:
                recipientInfo.adminapprovedstatus === "waiting"
                  ? "waiting"
                  : recipientInfo.targetamountstatus || "Unknown",
              className:
                recipientInfo.adminapprovedstatus === "waiting"
                  ? "text-orange-500"
                  : recipientInfo.targetamountstatus === "completed"
                  ? "text-green-600"
                  : "text-yellow-600",
            },
          ].map(({ label, value, className }, i) => (
            <div className="flex flex-col gap-1 items-start text-[17px] font-semibold" key={i}>
              <span className="text-gray-500 text-sm">{label}:</span>
              <span className={className || ""}>{value || "N/A"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Overview */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-black font-bold text-xl">Overview</h2>
        <p>{recipientInfo.overview || "N/A"}</p>
      </div>

      {/* Attachments */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-black font-bold text-xl">Attachments</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Medical Reports", file: recipientInfo.medicalreport },
            { label: "ID Proof", file: recipientInfo.identificationproof },
            { label: "Patient Image", file: recipientInfo.patientimg },
          ].map(({ label, file }, i) => (
            <div key={i}>
              <label className="block mb-1 font-medium">{label}</label>
              {file ? (
                <a
                  href={`${API_BASE_URL}/uploads/${file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View {label === "Patient Image" ? "Image" : "Document"}
                </a>
              ) : (
                <span className="text-gray-500">Not available</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progress and Donations */}
      {recipientInfo.adminapprovedstatus !== "waiting" && (
        <>
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h2 className="text-xl font-bold mb-2">Donation Progress</h2>
            <div className="mb-2">Progress: {recipientInfo.progressPercentage}%</div>
            <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full ${
                  recipientInfo.progressPercentage === 100 ? "bg-green-500" : "bg-blue-500"
                }`}
                style={{ width: `${recipientInfo.progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-sm">
              Raised: {convert(recipientInfo.raisedAmount)} | Goal:{" "}
              {convert(recipientInfo.donationamount)}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h2 className="text-xl font-bold mb-2">Donations</h2>
            {donations.length > 0 ? (
              <table className="w-full rounded-lg text-sm text-left border">
                <thead className="bg-[#333] text-white">
                  <tr>
                    <th className="p-2">Donor</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2">{donation.user?.username || "Anonymous"}</td>
                      <td className="p-2">{convert(donation.amount)}</td>
                      <td className="p-2">{formatDate(donation.donatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No donations received yet.</p>
            )}
          </div>
        </>
      )}

  
    </div>
  );
};

export default RecipientDetails;
