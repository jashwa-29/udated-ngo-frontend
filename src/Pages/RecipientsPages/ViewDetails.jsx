import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UserCircle2, Stethoscope, Target, Calendar, Info, FileText, ImageIcon, MoreHorizontal } from "lucide-react";
import { getReceiverDonationStatus } from '../../API/Receiver API/ReceiverStatus';
import { useCurrency } from '../../context/CurrencyContext';
import { toast } from 'react-hot-toast';
import Skeleton from '../../Components/CommonComponents/Skeleton';
import ErrorState from '../../Components/CommonComponents/ErrorState';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DetailsSkeleton = () => (
  <div className="max-w-7xl mx-auto px-6 mt-10 space-y-8 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white rounded-[2.5rem] p-10 h-64 shadow-sm border border-gray-100 flex gap-8">
          <Skeleton className="w-32 h-32 rounded-3xl shrink-0" />
          <div className="space-y-4 w-full">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
        <div className="bg-white rounded-[2.5rem] p-10 h-40 shadow-sm border border-gray-100" />
        <div className="bg-white rounded-[2.5rem] p-10 h-56 shadow-sm border border-gray-100" />
      </div>
      <div className="bg-white rounded-[2.5rem] p-8 h-[500px] shadow-sm border border-gray-100" />
    </div>
  </div>
);

const RecipientDetails = () => {
  const { convert } = useCurrency();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchRecipientData = useCallback(async (showToast = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getReceiverDonationStatus(user.token, id);
      setData(response);
      if (showToast) toast.success('Details refreshed');
    } catch (err) {
      console.error('Fetch Details Error:', err);
      setError(err.message || "Failed to fetch recipient data");
      toast.error('Failed to load details');
    } finally {
      setLoading(false);
    }
  }, [id, user.token]);

  useEffect(() => {
    fetchRecipientData();
  }, [fetchRecipientData]);

  const formatDate = (dateString, full = false) => {
    if (!dateString) return "N/A";
    const options = full 
      ? { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }
      : { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFB]">
      <div className="bg-white border-b border-gray-100 h-16" />
      <DetailsSkeleton />
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <ErrorState 
          message={error} 
          onRetry={() => fetchRecipientData(true)} 
          title="Couldn't load request" 
        />
      </div>
    );
  }

  if (!data) return <div className="p-8">No request found for ID {id}.</div>;

  const { donations = [], summary = { totalRaised: 0, donorCount: 0 }, ...recipientInfo } = data;
  const progressPercentage = recipientInfo.donationamount
    ? Math.min(Math.round((summary.totalRaised / recipientInfo.donationamount) * 100), 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-20">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs md:text-sm text-gray-600 font-bold hover:text-[#4D9186] transition-colors"
          >
            <ArrowLeft size={16} className="md:w-[18px]" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </button>
          <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${
            recipientInfo.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' : 
            recipientInfo.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' : 
            'bg-amber-100 text-amber-700 border-amber-200'
          }`}>
            {recipientInfo.status || 'Pending'}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details & Overview */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Patient Header Card */}
            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-start">
                <div className="relative shrink-0 mx-auto sm:mx-0">
                  {recipientInfo.otherproof ? (
                    <img
                      src={`${API_BASE_URL}/uploads/donation-requests/${recipientInfo.otherproof}`} 
                      alt="Patient"
                      className="w-24 h-24 md:w-32 md:h-32 rounded-3xl object-cover shadow-lg border-4 border-white"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=Patient';
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200">
                      <UserCircle2 className="w-10 h-10 md:w-12 md:h-12 text-gray-200" />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-[#4D9186] text-white p-1.5 md:p-2 rounded-xl shadow-lg">
                    <HeartIcon className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />
                  </div>
                </div>
                <div className="flex-1 pt-2 text-center sm:text-left">
                  <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-2 leading-tight">{recipientInfo.patientname}</h1>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                    <p className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 bg-gray-50 rounded-xl text-xs md:text-sm font-bold text-gray-500 border border-gray-100">
                      <Stethoscope className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#4D9186]" />
                      {recipientInfo.medicalproblem}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10 pt-8 border-t border-gray-50">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Age</p>
                  <p className="text-base md:text-lg font-bold text-gray-900">{recipientInfo.age}Y</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gender</p>
                  <p className="text-base md:text-lg font-bold text-gray-900 capitalize">{recipientInfo.gender || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Contact</p>
                  <p className="text-base md:text-lg font-bold text-gray-900 truncate">{recipientInfo.number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Submitted</p>
                  <p className="text-base md:text-lg font-bold text-gray-900">{formatDate(recipientInfo.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Overview Section */}
            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <Info className="w-5 h-5 text-[#4D9186]" />
                <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight">Case Overview</h2>
              </div>
              <p className="text-sm md:text-base text-gray-600 font-medium leading-[1.8] italic bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                "{recipientInfo.overview || "No overview provided."}"
              </p>
            </div>

            {/* Attachments Section */}
            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <FileText className="w-5 h-5 text-[#4D9186]" />
                <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight">Documentation</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Medical Reports", file: recipientInfo.medicalreport, icon: Stethoscope },
                  { label: "Identity Proof", file: recipientInfo.identificationproof, icon: ImageIcon },
                  { label: "Additional Photo", file: recipientInfo.otherproof, icon: ImageIcon },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#4D9186] shadow-sm">
                        <doc.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{doc.label}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verified Document</p>
                      </div>
                    </div>
                    {doc.file ? (
                      <a
                        href={`${API_BASE_URL}/uploads/donation-requests/${doc.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white text-[#4D9186] border border-[#4D9186]/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#4D9186] hover:text-white transition-all shadow-sm"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-300 uppercase">Missing</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Progress & Donations */}
          <div className="space-y-8">
            {/* Progress Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Fundraising Progress</h2>
                <div className="w-10 h-10 bg-[#4D9186]/10 rounded-xl flex items-center justify-center text-[#4D9186]">
                  <Target className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Raised So Far</p>
                      <p className="text-3xl font-black text-[#4D9186] tracking-tight">{convert(summary.totalRaised)}</p>
                    </div>
                    <div className="bg-[#4D9186]/10 px-3 py-1 rounded-full text-xs font-black text-[#4D9186]">
                      {progressPercentage}%
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 p-0.5 overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-[#4D9186] to-[#6fb9ac] rounded-full transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Goal</p>
                    <p className="text-xl font-black text-gray-900">{convert(recipientInfo.donationamount)}</p>
                  </div>
                  <div className="bg-gray-900 rounded-2xl p-4 text-white">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Total Supporters</p>
                    <p className="text-xl font-black">{summary.donorCount} Generous People</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                 <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#4D9186]" />
                    Donations Timeline
                 </h3>
                 <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {donations.length > 0 ? (
                      donations.map((donation, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center group hover:border-[#4D9186]/30 transition-all">
                          <div>
                            <p className="text-sm font-black text-gray-900 group-hover:text-[#4D9186] transition-colors">
                              {donation.donorId?.username || "Anonymous Donor"}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 tracking-wider">
                              {formatDate(donation.createdAt, true)}
                            </p>
                          </div>
                          <p className="font-black text-gray-900 text-sm">{convert(donation.amount)}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                        <MoreHorizontal className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No donations yet</p>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientDetails;

const HeartIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);
