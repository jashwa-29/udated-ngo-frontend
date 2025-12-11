import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { fetchSingleDonationRequestId, editApproveStatus } from "../../API/Admin API/recipientApi";
import { useCurrency } from '../../context/CurrencyContext';
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RequestDetails = () => {
  const { convert } = useCurrency();
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchRecipientData = async () => {
      try {
        setLoading(true);
        const data = await fetchSingleDonationRequestId(id, user.token);
        setRecipientInfo(data);
      } catch (err) {
        setError(err.message || "Failed to fetch recipient data");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipientData();
  }, [id, user.token]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setModalLoading(true);
      await editApproveStatus(id, newStatus, user.token);
      // Update local state instead of reloading the page
      setRecipientInfo(prev => ({
        ...prev,
        adminapprovedstatus: newStatus
      }));
      setShowModal(false);
    } catch (error) {
      console.error("Error updating approval status:", error);
    } finally {
      setModalLoading(false);
    }
  };

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

  const getFileUrl = (file) => {
    if (!file) return null;
    return `${API_BASE_URL}/Home/Files/${file}`;
  };

  if (loading) return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4D9186]"></div>
    </div>
  );

  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
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
                  : recipientInfo.adminapprovedstatus || "Unknown",
              className:
                recipientInfo.adminapprovedstatus === "waiting"
                  ? "text-orange-500"
                  : recipientInfo.adminapprovedstatus === "accepted"
                  ? "text-green-600"
                  : "text-red-600",
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
          ].map(({ label, file }, i) => {
            const fileUrl = getFileUrl(file);
            return (
              <div key={i}>
                <label className="block mb-1 font-medium">{label}</label>
                {fileUrl ? (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Download {label === "Patient Image" ? "Image" : "Document"}
                  </a>
                ) : (
                  <span className="text-gray-500">Not available</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Approval Actions */}
      {recipientInfo.adminapprovedstatus === "waiting" && (
        <div className="flex gap-4 mt-4">
          <button
            className="items-center justify-center hidden px-8 py-2.5 text-base font-semibold hover:text-[#4D9186] transition duration-300 bg-[#4D9186] hover:bg-white border border-white hover:border-[#4D9186] text-white rounded-[6px] lg:inline-flex"
            onClick={() => {
              setModalAction("accepted");
              setShowModal(true);
            }}
          >
            Approve
          </button>
          <button
            className="items-center justify-center hidden px-8 py-2.5 text-base font-semibold hover:text-red-600 transition duration-300 bg-red-600 hover:bg-white border border-white hover:border-red-600 text-white rounded-[6px] lg:inline-flex"
            onClick={() => {
              setModalAction("rejected");
              setShowModal(true);
            }}
          >
            Reject
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Confirm {modalAction === "accepted" ? "Approval" : "Rejection"}
            </h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to{" "}
              <span className="font-semibold text-black">
                {modalAction === "accepted" ? "approve" : "reject"}
              </span> this recipient?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                disabled={modalLoading}
                onClick={() => handleStatusUpdate(modalAction)}
                className={`px-4 py-2 text-white rounded-md ${
                  modalAction === "accepted" ? "bg-green-600" : "bg-red-600"
                } hover:opacity-90`}
              >
                {modalLoading ? "Processing..." : `Confirm ${modalAction === "accepted" ? "Approve" : "Reject"}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetails;