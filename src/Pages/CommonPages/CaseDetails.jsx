import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Heart, 
  FileText, 
  User, 
  Sparkles,
  Clock,
  Activity,
  Calendar,
  ChevronRight,
  Share2,
  Info
} from "lucide-react";
import axios from "axios";
import { useCurrency } from '../../context/CurrencyContext';
import DonationModal from '../../Components/HomeComponents/DonationModal';

const CaseDetails = () => {
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

      if (reqRes.data && reqRes.data.data) {
        setRequest(reqRes.data.data);
        const raised = Array.isArray(progRes.data) 
          ? progRes.data.reduce((sum, d) => sum + (d.amount || 0), 0)
          : 0;
        const goal = reqRes.data.data.donationamount;
        setProgress({
          raised,
          percentage: goal > 0 ? Math.min((raised / goal) * 100, 100) : 0
        });
      } else {
        setError("Case records not found.");
      }
    } catch (err) {
      console.error("Error fetching detail:", err);
      setError("Failed to load case data. Please try again later.");
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
    return `${import.meta.env.VITE_API_BASE_URL}/uploads/donation-requests/${filename}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-32 flex flex-col items-center justify-center p-8">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-100 rounded-full"></div>
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="mt-4 text-gray-500 font-medium tracking-wide animate-pulse">Loading Mission Data...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Info className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Case Not Found</h2>
          <p className="text-gray-500 mb-8">{error || "This donation request may have been moved or archived."}</p>
          <button 
            onClick={() => navigate('/receivers')}
            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold transition-all hover:bg-black"
          >
            Back to Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FBFCFD] min-h-screen pt-28 lg:pt-36 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Simple Breadcrumb-style Navigation */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate('/receivers')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            Back to Missions
          </button>
          <div className="flex items-center gap-4">
             <button className="p-2.5 text-gray-400 hover:text-primary transition-colors bg-white rounded-full border border-gray-100 shadow-sm">
                <Share2 className="w-4 h-4" />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Main Content Area (Column 1-8) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Header Content */}
            <header>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest border border-primary/20">
                  Medical Aid
                </span>
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  CASE ID: {request._id?.slice(-8).toUpperCase()}
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">
                Help Support <span className="text-primary">{request.patientname}'s</span> Recovery Journey
              </h1>
            </header>

            {/* Premium Image Showcase */}
            <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl bg-gray-100 group">
              {request.otherproof ? (
                <img 
                  src={getFileUrl(request.otherproof)} 
                  alt={request.patientname}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Heart className="w-24 h-24 text-gray-200" />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>

            {/* Medical Narrative Section */}
            <div className="bg-white p-10 lg:p-12 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
               <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-50">
                  <div className="p-3 bg-primary/5 text-primary rounded-2xl">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Medical Overview</h3>
               </div>
               
               <div className="prose prose-emerald max-w-none">
                  <p className="text-2xl font-bold leading-relaxed mb-8 italic text-primary/80">
                    "{request.medicalproblem}"
                  </p>
                  <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                    {request.overview}
                  </p>
               </div>
            </div>

            {/* Documents & Trust Section */}
            <div className="bg-gray-900 rounded-[2.5rem] p-10 lg:p-14 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
               
               <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                    <h3 className="text-2xl font-bold uppercase tracking-tight">Verified Recovery Records</h3>
                  </div>
                  
                  <p className="text-gray-400 font-medium mb-10 max-w-2xl leading-relaxed">
                    At our NGO, transparency is our foundation. We have thoroughly vetted this case. You can review the hospital documentation and identity records provided below.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { label: "Medical Report", file: request.medicalreport, type: "PDF/IMAGE" },
                      { label: "Identity Proof", file: request.identificationproof, type: "VERIFIED" },
                      { label: "Additional Info", file: request.otherproof, type: "DOCS" }
                    ].map((doc, i) => doc.file && (
                      <a 
                        key={i}
                        href={getFileUrl(doc.file)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-primary/50 transition-all group"
                      >
                        <FileText className="w-6 h-6 text-primary mb-3" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{doc.type}</span>
                        <span className="text-sm font-bold group-hover:text-primary transition-colors">{doc.label}</span>
                      </a>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar Area (Column 9-12) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Donation Sticky Card */}
            <div className="lg:sticky lg:top-36">
              <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_25px_60px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col">
                
                {/* Stats Container */}
                <div className="mb-8">
                   <div className="flex justify-between items-end mb-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Raised So Far</span>
                        <h4 className="text-4xl font-black text-gray-900 tracking-tighter">{convert(progress.raised)}</h4>
                      </div>
                      <span className="text-primary font-bold text-lg">{progress.percentage.toFixed(0)}%</span>
                   </div>
                   
                   {/* Progress Bar */}
                   <div className="w-full bg-gray-50 rounded-full h-3 overflow-hidden border border-gray-100 mb-4 p-0.5">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(77,145,134,0.3)]"
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                   </div>
                   
                   <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-400">
                      <span>Goal: {convert(request.donationamount)}</span>
                      <span className="text-primary">Need: {convert(Math.max(0, request.donationamount - progress.raised))}</span>
                   </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={handleDonateClick}
                    className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                    Support Mission
                  </button>
                  <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    🛡️ Secure Verified Donation
                  </p>
                </div>

                {/* Patient Profile Sub-Card */}
                <div className="mt-12 pt-10 border-t border-gray-50 space-y-6">
                   <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Patient Profile</h5>
                   <div className="space-y-4">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100">
                            <User className="w-6 h-6" />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Full Name</p>
                            <p className="font-bold text-gray-900">{request.patientname}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100">
                            <Clock className="w-6 h-6" />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Patient Age</p>
                            <p className="font-bold text-gray-900">{request.age} Years Old</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100">
                            <Calendar className="w-6 h-6" />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Launched On</p>
                            <p className="font-bold text-gray-900">{formatDate(request.createdAt)}</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Trust Badge */}
                <div className="mt-10 bg-gray-50 p-6 rounded-2xl border border-dotted border-gray-200">
                   <div className="flex items-start gap-4">
                      <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
                      <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-widest">
                        This mission is verified by Swiflare's medical board.
                      </p>
                   </div>
                </div>
              </div>
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

export default CaseDetails;
