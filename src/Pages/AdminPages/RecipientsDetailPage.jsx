import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  User, 
  Activity, 
  Trophy, 
  XCircle, 
  Eye, 
  Calendar, 
  Phone,
  FileText,
  ShieldCheck,
  Stethoscope,
  ArrowRight
} from "lucide-react";
import { fetchSingleDonationByRecipientId, editApproveStatus } from "../../API/Admin API/recipientApi";
import { useCurrency } from '../../context/CurrencyContext';
import Skeleton from '../../Components/CommonComponents/Skeleton';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RecipientDetails = () => {
  const { convert } = useCurrency();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { recipientId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [showModal, setShowModal] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchSingleDonationByRecipientId(recipientId, user.token);
        setRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching recipient data:", err);
        setError(err.message || "Failed to fetch recipient data");
      } finally {
        setLoading(false);
      }
    };

    if (recipientId && user?.token) fetchData();
  }, [recipientId, user?.token]);

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      setModalLoading(true);
      await editApproveStatus(requestId, newStatus, user.token);
      
      setRequests(prev => prev.map(req => 
        req._id === requestId ? { ...req, status: newStatus } : req
      ));
      
      setShowModal(false);
      setActiveRequestId(null);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      'pending': { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', label: 'Under Review' },
      'approved': { icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', label: 'Approved' },
      'achieved': { icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'Goal Achieved' },
      'rejected': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', label: 'Declined' }
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  if (loading) return (
    <div className="p-8 mt-20 max-w-7xl mx-auto space-y-8">
      <Skeleton className="w-48 h-10 rounded-xl" />
      <div className="space-y-6">
        {[1, 2].map(i => <Skeleton key={i} className="h-[400px] rounded-[2.5rem]" />)}
      </div>
    </div>
  );

  if (error) return (
    <div className="p-12 mt-20 max-w-2xl mx-auto text-center bg-white border border-gray-100 rounded-[2.5rem] shadow-sm">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <AlertCircle size={40} />
      </div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Oops! Something went wrong</h2>
      <p className="text-gray-500 font-medium mb-8">{error}</p>
      <button onClick={() => navigate(-1)} className="px-8 py-4 bg-[#4D9186] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#3d7a70] transition-all">Go Back</button>
    </div>
  );

  return (
    <div className="p-4 md:p-8 mt-16 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-[#4D9186] transition-colors mb-4 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Case <span className="text-[#4D9186]">History</span>
          </h1>
          <p className="text-gray-500 font-medium">Viewing all requests submitted by this recipient.</p>
        </div>
        <div className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Requests</p>
          <p className="text-xl font-black text-gray-900">{requests.length}</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="p-20 text-center bg-white border border-gray-100 rounded-[2.5rem] shadow-sm">
          <Clock className="mx-auto text-gray-200 mb-6" size={64} />
          <p className="text-gray-500 text-lg font-bold">No donation requests found.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {requests.map((request) => {
            const config = getStatusConfig(request.status);
            const StatusIcon = config.icon;

            return (
              <div key={request._id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden hover:shadow-md transition-shadow">
                {/* Case Card Header */}
                <div className="px-8 md:px-10 py-6 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${config.bg} ${config.color} border ${config.border}`}>
                      <StatusIcon size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Case #{request._id.slice(-6)}</h2>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(request.createdAt).toLocaleDateString()} • {new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.bg} ${config.color} ${config.border}`}>
                      {config.label}
                    </div>
                    <Link 
                      to={`/admin/request/${request._id}`}
                      className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-[#4D9186]/10 hover:text-[#4D9186] transition-all group"
                      title="View Full Details"
                    >
                      <Eye size={18} className="group-hover:scale-110 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Case Card Content */}
                <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                  {/* Left: Patient Stats */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Patient</p>
                        <p className="text-sm font-black text-gray-900 truncate">{request.patientname}</p>
                      </div>
                      <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Age/Gen</p>
                        <p className="text-sm font-black text-gray-900">{request.age}Y • {request.gender?.charAt(0)}</p>
                      </div>
                    </div>
                    <div className="p-6 bg-[#4D9186] rounded-[2rem] text-white shadow-lg shadow-[#4D9186]/20">
                      <p className="text-[10px] font-black opacity-70 uppercase tracking-widest mb-1">Funding Target</p>
                      <p className="text-3xl font-black tracking-tight">{convert(request.donationamount)}</p>
                    </div>
                    <div className="p-6 bg-white border border-gray-100 rounded-[2rem] space-y-3">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <ShieldCheck size={12} />
                        Verification Proofs
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {request.medicalreport && (
                           <a href={`${API_BASE_URL}/uploads/donation-requests/${request.medicalreport}`} target="_blank" rel="noreferrer" className="px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase hover:bg-blue-100 transition-colors">Medical Report</a>
                        )}
                        {request.identificationproof && (
                           <a href={`${API_BASE_URL}/uploads/donation-requests/${request.identificationproof}`} target="_blank" rel="noreferrer" className="px-3 py-2 bg-purple-50 text-purple-600 rounded-xl text-[10px] font-black uppercase hover:bg-purple-100 transition-colors">ID Proof</a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Medical Problem */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Medical Condition</p>
                      <div className="p-6 bg-gray-50 border border-gray-100 rounded-3xl">
                        <h4 className="font-black text-gray-900 mb-2 truncate">{request.medicalproblem}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium line-clamp-4">{request.overview}</p>
                      </div>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex gap-4 pt-4 border-t border-gray-50">
                        <button 
                          onClick={() => { setActiveRequestId(request._id); setModalAction('approved'); setShowModal(true); }}
                          className="flex-1 bg-[#4D9186] text-white font-black py-4 rounded-2xl shadow-lg shadow-[#4D9186]/10 hover:shadow-[#4D9186]/20 transition-all hover:scale-[1.02] active:scale-95 text-xs uppercase tracking-widest"
                        >
                          Approve Request
                        </button>
                        <button 
                          onClick={() => { setActiveRequestId(request._id); setModalAction('rejected'); setShowModal(true); }}
                          className="flex-1 bg-red-50 text-red-600 border border-red-100 font-black py-4 rounded-2xl hover:bg-red-100 transition-all hover:scale-[1.02] active:scale-95 text-xs uppercase tracking-widest"
                        >
                          Reject Case
                        </button>
                      </div>
                    )}

                    {request.status === 'approved' && (
                      <div className="pt-4">
                        <Link to={`/admin/request/${request._id}`} className="flex items-center justify-center gap-2 w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-[#4D9186] transition-all group text-xs uppercase tracking-widest">
                          Manage Fundraising
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-md relative z-10 shadow-2xl">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${modalAction === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Confirm {modalAction === 'approved' ? 'Approval' : 'Rejection'}</h2>
            <p className="text-gray-500 font-medium mb-8">
              This action will update the request status and notify the recipient. This process cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-4 bg-gray-50 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate(activeRequestId, modalAction)}
                disabled={modalLoading}
                className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 disabled:opacity-50 ${modalAction === 'approved' ? 'bg-[#4D9186] shadow-emerald-200' : 'bg-red-600 shadow-red-200'}`}
              >
                {modalLoading ? "Processing..." : `Confirm ${modalAction}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipientDetails;

