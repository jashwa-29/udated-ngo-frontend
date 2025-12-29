import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Stethoscope, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  Trophy,
  ExternalLink,
  ShieldCheck,
  Activity,
  ArrowRight,
  Mail,
  Home,
  Heart,
  Trash2
} from "lucide-react";
import { toast } from 'react-hot-toast';
import { useCurrency } from '../../context/CurrencyContext';
import axios from "axios";
import Skeleton from '../../Components/CommonComponents/Skeleton';
import ErrorState from '../../Components/CommonComponents/ErrorState';
import DeleteConfirmationModal from '../../Components/CommonComponents/DeleteConfirmationModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RequestDetails = () => {
  const { convert } = useCurrency();
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donations, setDonations] = useState([]);
  const [summary, setSummary] = useState({ totalRaised: 0, donorCount: 0 });
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({ 
    isOpen: false, 
    isLoading: false 
  });

  useEffect(() => {
    fetchRecipientData();
    fetchDonations();
  }, [id]);

  const fetchDonations = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/GetRequestDonations/${id}`,
        {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setDonations(response.data.data || []);
      setSummary(response.data.summary || { totalRaised: 0, donorCount: 0 });
    } catch (err) {
      console.error('Error fetching donations:', err);
    }
  };

  const fetchRecipientData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `${API_BASE_URL}/admin/GetSingleDonationRequest/${id}`,
        {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.data || !response.data.data) {
        throw new Error('No data received from server');
      }
      
      const data = response.data.data;
      
      const constructUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
      };

      const formattedRecipientInfo = {
        id: data._id,
        patientname: data.patientname,
        age: data.age,
        gender: data.gender,
        number: data.number,
        medicalproblem: data.medicalproblem,
        donationamount: data.donationamount,
        overview: data.overview,
        status: data.status,
        medicalreport: constructUrl(data.medicalreportUrl || `/uploads/donation-requests/${data.medicalreport}`),
        identificationproof: constructUrl(data.identificationproofUrl || `/uploads/donation-requests/${data.identificationproof}`),
        otherproof: constructUrl(data.otherproofUrl || (data.otherproof ? `/uploads/donation-requests/${data.otherproof}` : null)),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
      
      let extractedUserInfo = {};
      if (data.userId && typeof data.userId === 'object') {
        extractedUserInfo = {
          username: data.userId.username,
          email: data.userId.email,
          mobile: data.userId.mobile,
          address: data.userId.address,
          role: data.userId.role
        };
      } else if (location.state?.userInfo) {
        extractedUserInfo = location.state.userInfo;
      }
      
      setRecipientInfo(formattedRecipientInfo);
      setUserInfo(extractedUserInfo);
    } catch (err) {
      console.error('Error fetching recipient data:', err);
      setError(err.response?.data?.message || err.message || "Failed to fetch recipient data");
      
      if (location.state?.recipientData) {
        setRecipientInfo(location.state.recipientData);
        setUserInfo(location.state.userInfo || {});
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setModalLoading(true);
      
      await axios.put(
        `${API_BASE_URL}/admin/UpdateRequestStatus/${id}/${newStatus}`,
        {},
        {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setRecipientInfo(prev => ({
        ...prev,
        status: newStatus
      }));
      
      setShowModal(false);
    } catch (error) {
      console.error("Error updating approval status:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteModal({ isOpen: true, isLoading: false });
  };

  const confirmDelete = async () => {
    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      await axios.delete(`${API_BASE_URL}/admin/deleteDonationRequest/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success('Donation request deleted successfully');
      setDeleteModal({ isOpen: false, isLoading: false });
      navigate(-1);
    } catch (err) {
      console.error('Error deleting donation request:', err);
      toast.error(err.response?.data?.message || 'Failed to delete donation request');
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      'pending': { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', label: 'Under Review' },
      'approved': { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', label: 'Approved' },
      'achieved': { icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'Goal Achieved' },
      'rejected': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', label: 'Declined' }
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  if (loading) return (
    <div className="p-8 mt-20 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Skeleton className="w-24 h-8 rounded-full" />
        <Skeleton className="w-48 h-10 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-64 rounded-[2rem]" />
          <Skeleton className="h-96 rounded-[2rem]" />
        </div>
        <div className="space-y-8">
          <Skeleton className="h-48 rounded-[2rem]" />
          <Skeleton className="h-[400px] rounded-[2rem]" />
        </div>
      </div>
    </div>
  );

  if (error || !recipientInfo) {
    return (
      <div className="p-8 mt-20 max-w-4xl mx-auto">
        <ErrorState 
          title="Case Not Found"
          message={error || "This donation request could not be found. It may have been deleted or the link is invalid."}
          onRetry={() => navigate('/admin/dashboard')}
        />
      </div>
    );
  }

  const config = getStatusConfig(recipientInfo.status);
  const StatusIcon = config.icon;
  const rawGoal = recipientInfo.donationamount?.toString() || "0";
  const goalAmount = parseFloat(rawGoal.replace(/[^0-9.]/g, '')) || 1; // Fallback to 1 to avoid / 0
  const progressPercent = Math.min((summary.totalRaised / goalAmount) * 100, 100);

  return (
    <div className="p-4 md:p-8 mt-20 md:mt-16 max-w-7xl mx-auto min-h-screen">
      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 md:mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 md:p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] truncate">Case: #{recipientInfo.id.slice(-6)}</span>
              <div className={`px-2 py-0.5 rounded-full ${config.bg} ${config.color} border ${config.border} text-[8px] md:text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0`}>
                <StatusIcon className="w-3 h-3" />
                {config.label}
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight truncate">
              Patient <span className="text-[#4D9186]">Detail</span>
            </h1>
          </div>
        </div>

        {recipientInfo.status === 'pending' && (
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button
              onClick={() => { setModalAction("approved"); setShowModal(true); }}
              className="flex-1 sm:flex-none px-4 md:px-6 py-3 bg-[#4D9186] text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-[#3d7a70] shadow-lg shadow-[#4D9186]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={() => { setModalAction("rejected"); setShowModal(true); }}
              className="flex-1 sm:flex-none px-4 md:px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
            <button
              onClick={handleDelete}
              className="w-full sm:w-auto px-4 md:px-6 py-3 bg-white text-red-600 border border-red-100 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-red-50 transition-all active:scale-95 flex items-center justify-center gap-2"
              title="Delete Request"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
        
        {recipientInfo.status !== 'pending' && (
          <button
            onClick={handleDelete}
            className="px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Request
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Fundraising Card */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 md:p-10 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between gap-6 md:gap-8 mb-8 relative z-10">
              <div className="space-y-1">
                <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Target Amount</p>
                <p className="text-3xl md:text-4xl font-black text-gray-900">{convert(recipientInfo.donationamount)}</p>
              </div>
              <div className="flex gap-6 md:gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Raised</p>
                  <p className="text-xl md:text-2xl font-black text-emerald-600">{convert(summary.totalRaised)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Donors</p>
                  <p className="text-xl md:text-2xl font-black text-blue-600">{summary.donorCount}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-end">
                <p className="text-sm font-bold text-gray-900">Campaign Progress</p>
                <p className="text-xs font-black text-[#4D9186] uppercase tracking-widest">{Math.round(progressPercent)}% Reached</p>
              </div>
              <div className="h-4 bg-gray-50 rounded-full overflow-hidden p-1 border border-gray-100">
                <div 
                  className="h-full bg-[#4D9186] rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(77,145,134,0.3)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {progressPercent >= 100 && (
              <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700 font-bold text-sm">
                <Trophy className="w-5 h-5" />
                This campaign has successfully reached its target goal!
              </div>
            )}
          </div>

          {/* Detailed Information */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
            <div className="p-8 md:p-10 border-b border-gray-50">
              <div className="flex items-center gap-3 mb-1">
                <Stethoscope className="w-5 h-5 text-[#4D9186]" />
                <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Medical Overview</h2>
              </div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">In-depth case analysis and medical records</p>
            </div>
            
            <div className="p-8 md:p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#4D9186]/30 transition-all">
                    <User className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Patient Info</p>
                      <p className="text-gray-900 font-black">{recipientInfo.patientname} ({recipientInfo.age}Y, {recipientInfo.gender})</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#4D9186]/30 transition-all">
                    <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Submitted Date</p>
                      <p className="text-gray-900 font-black">{new Date(recipientInfo.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#4D9186]/30 transition-all">
                    <Phone className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact No.</p>
                      <p className="text-gray-900 font-black">{recipientInfo.number}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#4D9186]/30 transition-all">
                    <Activity className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Condition</p>
                      <p className="text-gray-900 font-black">{recipientInfo.medicalproblem}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Case Narrative</p>
                <div className="p-6 md:p-8 bg-gray-50 rounded-[2rem] border border-gray-100 text-gray-700 leading-relaxed font-medium text-sm md:text-base">
                  {recipientInfo.overview || "No detailed overview provided for this case."}
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Verification Documents</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Medical Report", url: recipientInfo.medicalreport, icon: Stethoscope, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: "Identity Proof", url: recipientInfo.identificationproof, icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: "Patient Image", url: recipientInfo.otherproof, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50', optional: true }
                  ].map((doc, i) => (
                    doc.url ? (
                      <a 
                        key={i} 
                        href={doc.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl hover:border-[#4D9186] hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 ${doc.bg} ${doc.color} rounded-2xl`}>
                            <doc.icon className="w-5 h-5" />
                          </div>
                          <span className="font-black text-gray-900 text-sm tracking-tight">{doc.label}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-[#4D9186] transition-colors" />
                      </a>
                    ) : !doc.optional && (
                      <div key={i} className="flex items-center gap-4 p-5 bg-gray-50 border border-dashed border-gray-200 rounded-3xl opacity-50">
                        <div className="p-3 bg-gray-200 text-gray-400 rounded-2xl">
                          <doc.icon className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-gray-400 text-sm italic">{doc.label} Missing</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* User Info Card */}
          {userInfo && (
            <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 bg-[#4D9186]/5">
                <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">Requester Profile</h3>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#4D9186] flex items-center justify-center font-black text-white text-xl shadow-lg shadow-[#4D9186]/20">
                    {userInfo.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-gray-900 truncate max-w-[150px]">{userInfo.username}</p>
                    <p className="text-[10px] font-black text-[#4D9186] uppercase tracking-widest">{userInfo.role}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 font-medium truncate">{userInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 font-medium">{userInfo.mobile || "No mobile"}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <span className="text-gray-600 font-medium leading-relaxed">{userInfo.address || "Address not provided"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Donation History Sidebar */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-gray-50">
              <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">Donation Stream</h3>
            </div>
            <div className="p-8 flex-1">
              {donations.length > 0 ? (
                <div className="space-y-6">
                  {donations.slice(0, 5).map((d) => (
                    <div key={d._id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-black text-gray-400 group-hover:bg-[#4D9186]/10 group-hover:text-[#4D9186] transition-colors">
                          {d.donorId?.username?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 truncate max-w-[100px]">{d.donorId?.username}</p>
                          <p className="text-[10px] text-gray-400 font-bold">{new Date(d.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-[#4D9186]">{convert(d.amount)}</p>
                    </div>
                  ))}
                  {donations.length > 5 && (
                    <Link to="/admin/donations" className="block text-center pt-4 border-t border-gray-50 text-xs font-black text-gray-400 hover:text-[#4D9186] uppercase tracking-widest transition-colors">
                      View full history
                    </Link>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto">
                    <Heart className="w-6 h-6 text-gray-200" />
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Awaiting First Donor</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
                onClick={() => handleStatusUpdate(modalAction)}
                disabled={modalLoading}
                className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 disabled:opacity-50 ${modalAction === 'approved' ? 'bg-[#4D9186] shadow-emerald-200' : 'bg-red-600 shadow-red-200'}`}
              >
                {modalLoading ? "Processing..." : `Confirm ${modalAction}`}
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        isLoading={deleteModal.isLoading}
        onClose={() => setDeleteModal({ isOpen: false, isLoading: false })}
        onConfirm={confirmDelete}
        title="Delete Request"
        message="Are you sure you want to delete this donation request? This will permanently remove the case and all associated data."
      />
    </div>
  );
};

export default RequestDetails;