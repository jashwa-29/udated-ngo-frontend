import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShieldCheckIcon, HeartIcon, ProgressIcon, FileTextIcon, UserIcon, Sparkles } from "lucide-react";
import axios from "axios";
import { useCurrency } from '../../context/CurrencyContext';
import DonationModal from '../../Components/HomeComponents/DonationModal';

const MyDonationsDetail = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { convert } = useCurrency();
  const [request, setRequest] = useState(null);
  const [progress, setProgress] = useState({ raised: 0, percentage: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    setUser(loggedInUser);
  }, []);

  const handleDonateClick = () => {
    if (user && user.role === 'DONOR') {
      setShowModal(true);
    } else {
      navigate('/donor-login');
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const [reqRes, progRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/Home/GetSingleRequest/${requestId}`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/Home/GetdonationStatus/${requestId}`)
      ]);

      setRequest(reqRes.data.data);
      const raised = Array.isArray(progRes.data) 
        ? progRes.data.reduce((sum, d) => sum + (d.amount || 0), 0)
        : 0;
      const goal = reqRes.data.data.donationamount;
      setProgress({
        raised,
        percentage: goal > 0 ? Math.min((raised / goal) * 100, 100) : 0
      });
    } catch (err) {
      console.error("Error fetching detail:", err);
      setError("Failed to load mission details.");
    } finally {
      setIsLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [fetchData]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getFileUrl = (filename) => {
    if (!filename) return null;
    return `${import.meta.env.VITE_API_BASE_URL}/Home/image/${filename}`;
  };

  if (isLoading) return <div className="p-20 text-center font-black animate-pulse">Loading Mission Data...</div>;
  if (error || !request) return <div className="p-20 text-center text-red-500 font-black">{error || "Mission not found."}</div>;

  return (
    <div className="bg-[#FCFDFD] min-h-screen pt-32 pb-32 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-gray-400 hover:text-[#4D9186] transition-colors mb-12 group"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:bg-[#4D9186] group-hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Gallery</span>
        </button>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 items-start">
             <div className="relative group">
                 <div className="absolute inset-0 bg-[#4D9186]/10 rounded-[3rem] -translate-x-4 translate-y-4 -z-10 group-hover:-translate-x-2 group-hover:translate-y-2 transition-transform duration-700"></div>
                 <div className="h-[450px] rounded-[3rem] overflow-hidden shadow-2xl relative">
                     {request.patientimg ? (
                         <img 
                            src={getFileUrl(request.patientimg)} 
                            alt={request.patientname} 
                            className="w-full h-full object-cover transform transition-transform duration-[2s] group-hover:scale-110"
                         />
                     ) : (
                         <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                             <HeartIcon className="w-24 h-24 text-gray-100" />
                         </div>
                     )}
                     <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-10 pt-20">
                         <span className="text-[10px] font-black text-[#4D9186] bg-white px-4 py-2 rounded-xl uppercase tracking-widest shadow-lg inline-block mb-4">Urgent</span>
                         <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{request.patientname}</h1>
                     </div>
                 </div>
             </div>

             <div className="space-y-10">
                 <div>
                    <h2 className="text-5xl font-black text-gray-900 uppercase tracking-tighter mb-4 leading-none">The <span className="text-[#4D9186]">Mission</span></h2>
                    <p className="text-gray-500 font-bold leading-relaxed italic bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-6">
                      "{request.medicalproblem}"
                    </p>
                    <button 
                      onClick={handleDonateClick}
                      className="w-full py-5 bg-[#4D9186] text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-gray-900 transition-all shadow-xl shadow-[#4D9186]/10 flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      <Sparkles className="w-5 h-5" />
                      Add Further Support
                    </button>
                 </div>

                 {/* Progress Stats */}
                 <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100">
                    <div className="flex justify-between items-end mb-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fundraising Total</span>
                            <span className="text-4xl font-black text-gray-900 tracking-tighter">{convert(progress.raised)}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Remaining</span>
                            <span className="text-xl font-black text-[#4D9186] tracking-tighter">{convert(request.donationamount - progress.raised)}</span>
                        </div>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner p-1 mb-8">
                        <div 
                          className="bg-gradient-to-r from-[#4D9186] to-[#6fb9ac] h-full rounded-full transition-all duration-[2s] ease-out shadow-lg"
                          style={{ width: `${progress.percentage}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between items-center bg-gray-50 p-6 rounded-3xl border border-gray-100">
                        <div className="flex flex-col">
                           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Goal Target</span>
                           <span className="font-black text-gray-900">{convert(request.donationamount)}</span>
                        </div>
                        <div className="h-10 w-[1px] bg-gray-200"></div>
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Impact Status</span>
                            <span className="font-black text-gray-900">{progress.percentage.toFixed(0)}% Achieved</span>
                        </div>
                    </div>
                 </div>
             </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            {/* Overview */}
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-8">
                   <div className="p-3 bg-blue-50 rounded-2xl">
                      <FileTextIcon className="w-6 h-6 text-blue-500" />
                   </div>
                   <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Medical Overview</h4>
                </div>
                <p className="text-gray-500 font-medium leading-relaxed italic whitespace-pre-line">
                   {request.overview}
                </p>
            </div>

            {/* Recipient Details */}
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-8">
                   <div className="p-3 bg-purple-50 rounded-2xl">
                      <UserIcon className="w-6 h-6 text-purple-500" />
                   </div>
                   <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Patient Details</h4>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    {[
                        { label: "Full Name", value: request.patientname },
                        { label: "Age", value: `${request.age} Years` },
                        { label: "Contact Status", value: "Verified Private" },
                        { label: "Submission Date", value: formatDate(request.createdAt) }
                    ].map((detail, i) => (
                        <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{detail.label}</span>
                            <span className="font-black text-gray-900 uppercase text-sm tracking-tight">{detail.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Attachments Section */}
        <div className="bg-gray-900 p-12 md:p-16 rounded-[4rem] text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#4D9186]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                 <div className="text-center md:text-left">
                    <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">Vetting & <span className="text-[#4D9186]">Trust</span></h3>
                    <p className="text-gray-400 font-bold max-w-md italic">
                      We maintain absolute transparency. View the verified hospital documentation for this case.
                    </p>
                 </div>

                 <div className="flex flex-col gap-4 w-full md:w-auto">
                    {[
                      { label: "Medical Diagnosis", file: request.medicalreport },
                      { label: "Identity Proof", file: request.identificationproof },
                      { label: "Other Documents", file: request.otherproof }
                    ].map((doc, i) => doc.file && (
                        <a 
                          key={i}
                          href={getFileUrl(doc.file)} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center justify-between gap-6 px-10 py-5 bg-white/5 border border-white/10 rounded-3xl hover:bg-[#4D9186] hover:border-[#4D9186] transition-all group"
                        >
                           <span className="text-[10px] font-black uppercase tracking-widest">{doc.label}</span>
                           <ShieldCheckIcon className="w-5 h-5 text-[#4D9186] group-hover:text-white transition-colors" />
                        </a>
                    ))}
                 </div>
             </div>
        </div>
      </div>

      <DonationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={fetchData}
        card={{ ...request, id: request._id || requestId }}
      />
    </div>
  );
};

export default MyDonationsDetail;