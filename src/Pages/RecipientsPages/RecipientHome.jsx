import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReceiverStatus } from '../../API/Receiver API/ReceiverStatus';
import { toast } from 'react-hot-toast';
import Skeleton from '../../Components/CommonComponents/Skeleton';
import ErrorState from '../../Components/CommonComponents/ErrorState';
import { 
  HeartIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  CalendarIcon,
  PlusCircleIcon,
  ChevronRightIcon,
  LayoutDashboardIcon,
  TrophyIcon
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const RequestCardSkeleton = () => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
    <div className="flex justify-between">
      <Skeleton className="h-8 w-24 rounded-full" />
      <Skeleton className="h-4 w-20" />
    </div>
    <Skeleton className="h-10 w-3/4" />
    <div className="space-y-3">
      <Skeleton className="h-20 w-full rounded-2xl" />
      <Skeleton className="h-16 w-full rounded-2xl" />
    </div>
    <Skeleton className="h-14 w-full rounded-2xl mt-4" />
  </div>
);

const RecipientHome = () => {
  const navigate = useNavigate();
  const { convert } = useCurrency();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchStatus = useCallback(async (showToast = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReceiverStatus(user.token, user.userId);
      setRequests(Array.isArray(data) ? data : []);
      if (showToast) toast.success('Dashboard updated');
    } catch (error) {
      console.error('Failed to fetch request status', error);
      setError('Unable to load your requests. Please check your connection.');
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, [user?.token, user?.userId]);

  useEffect(() => {
    if (user?.token) {
      fetchStatus();
    } else {
      setLoading(false);
    }
  }, [fetchStatus]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const statusConfig = {
    achieved: {
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: TrophyIcon,
      label: 'Goal Achieved'
    },
    approved: {
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: CheckCircleIcon,
      label: 'Approved'
    },
    pending: {
      color: 'bg-amber-100 text-amber-700 border-amber-200',
      icon: ClockIcon,
      label: 'Under Review'
    },
    rejected: {
      color: 'bg-red-100 text-red-700 border-red-200',
      icon: XCircleIcon,
      label: 'Declined'
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-6 mt-16 md:mt-0">
          <div>
            <div className="flex items-center gap-2 text-[#4D9186] font-bold uppercase tracking-wider text-[10px] md:text-xs mb-2">
              <LayoutDashboardIcon className="w-4 h-4" />
              Recipient Dashboard
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              Manage Your <span className="text-[#4D9186]">Requests</span>
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-2 font-medium">
              Track medical fund requests and donation progress.
            </p>
          </div>

          <button
            onClick={() => navigate('/recipient/request')}
            className="flex items-center justify-center gap-2 bg-[#4D9186] hover:bg-[#3d7a70] text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-[#4D9186]/20 active:scale-95 text-sm md:text-base"
          >
            <PlusCircleIcon className="w-5 h-5" />
            New Request
          </button>
        </div>

        {/* content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <RequestCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchStatus(true)} />
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-20 text-center">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <HeartIcon className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Requests Found</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">
              You haven't submitted any donation requests yet. Start by creating a new request.
            </p>
            <button
              onClick={() => navigate('/recipient/request')}
              className="text-[#4D9186] font-bold border-b-2 border-[#4D9186] pb-1 hover:text-[#3d7a70] hover:border-[#3d7a70] transition-all"
            >
              Submit your first request
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {requests.map((item) => {
              const status = item.status?.toLowerCase() || 'pending';
              const config = statusConfig[status] || statusConfig.pending;
              const StatusIcon = config.icon;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${config.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {config.label}
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <CalendarIcon className="w-3 h-3" />
                        {formatDate(item.createdAt)}
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-[#4D9186] transition-colors line-clamp-1">
                      {item.patientname}
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Medical Condition</p>
                        <p className="text-gray-700 font-semibold line-clamp-2 leading-relaxed">
                          {item.medicalproblem}
                        </p>
                      </div>

                      <div className="flex justify-between items-end bg-[#4D9186]/5 rounded-2xl p-4 border border-[#4D9186]/10">
                        <div>
                          <p className="text-[10px] font-bold text-[#4D9186] uppercase tracking-wider mb-1">Target Goal</p>
                          <p className="text-xl font-black text-gray-900 tracking-tight">
                            {convert(item.donationamount)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/recipient/recipient-details/${item._id}`)}
                      className="w-full mt-8 py-4 bg-gray-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#4D9186] transition-all flex items-center justify-center gap-2 group/btn active:scale-95"
                    >
                      View Full Details
                      <ChevronRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientHome;
