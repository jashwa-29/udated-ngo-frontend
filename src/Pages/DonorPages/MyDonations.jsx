import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { HeartIcon, ExternalLinkIcon, CalendarIcon, WalletIcon } from "lucide-react";
import { myDonation } from "../../API/Donor API/MyDonation";
import { useCurrency } from '../../context/CurrencyContext';
import { toast } from 'react-hot-toast';
import Skeleton from '../../Components/CommonComponents/Skeleton';
import ErrorState from '../../Components/CommonComponents/ErrorState';

const DonationRowSkeleton = () => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-8 h-40">
    <div className="flex-1 space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16 w-full lg:w-auto">
      <div className="space-y-2"><Skeleton className="h-3 w-16" /><Skeleton className="h-6 w-24" /></div>
      <div className="space-y-2"><Skeleton className="h-3 w-16" /><Skeleton className="h-6 w-24" /></div>
      <div className="space-y-2 hidden lg:block"><Skeleton className="h-3 w-16" /><Skeleton className="h-6 w-24" /></div>
    </div>
    <Skeleton className="h-14 w-14 rounded-2xl" />
  </div>
);

const MyDonations = () => {
  const { convert } = useCurrency();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyDonations = useCallback(async (showToast = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.token) {
        setError("Please login to view your donations.");
        return;
      }
      const data = await myDonation(user.token);
      setDonations(data || []);
      console.log("Fetched donations:", data);
      if (showToast) toast.success('Donation history updated');
    } catch (error) {
      console.error("Error fetching donations:", error);
      setError("Failed to fetch your donation history.");
      toast.error('Unable to load donations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyDonations();
  }, [fetchMyDonations]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className='p-8 md:p-12 bg-[#FCFDFD] min-h-screen'>
         <div className="mb-12">
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
         </div>
         <div className="grid gap-6">
            {[1, 2, 3].map(i => <DonationRowSkeleton key={i} />)}
         </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <ErrorState 
          message={error} 
          onRetry={() => fetchMyDonations(true)} 
          title="Couldn't load history" 
        />
      </div>
    );
  }

  return (
    <div className='p-6 md:p-12 bg-[#FCFDFD] min-h-screen'>
      <div className="mb-10 md:mb-12 mt-16 md:mt-0">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">My <span className="text-[#4D9186]">Impact</span></h1>
        <p className="text-gray-500 font-bold italic uppercase text-[10px] md:text-xs tracking-[0.2em] leading-relaxed">Tracing your legacy of kindness across the platform.</p>
      </div>

      <div className="grid gap-6">
        {donations.length > 0 ? (
          donations.map((item) => (
            <div
              key={item._id}
              className="group bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-100 transition-all duration-500 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden"
            >
              {/* Status Indicator */}
              <div className="absolute top-0 left-0 w-2 h-full bg-[#4D9186]/20 group-hover:bg-[#4D9186] transition-colors"></div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#4D9186]/10 rounded-xl">
                    <HeartIcon className="w-4 h-4 text-[#4D9186]" />
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Medical Mission</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight group-hover:text-[#4D9186] transition-colors">
                  {item.requestId?.patientname || 'Unknown Patient'}
                </h3>
                <p className="text-gray-500 font-bold italic text-sm mt-1 line-clamp-1 truncate">
                  {item.requestId?.medicalproblem}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-16">
                 <div>
                    <div className="flex items-center gap-2 mb-2">
                       <WalletIcon className="w-3 h-3 text-gray-300" />
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Amount Donated</span>
                    </div>
                    <p className="text-xl font-black text-[#4D9186] tracking-tighter leading-none">{convert(item.amount)}</p>
                 </div>

                 <div>
                    <div className="flex items-center gap-2 mb-2">
                       <CalendarIcon className="w-3 h-3 text-gray-300" />
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Transaction Date</span>
                    </div>
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight leading-none">{formatDate(item.createdAt)}</p>
                 </div>

                 <div className="sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-2 h-2 rounded-full bg-green-500"></div>
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Payment Status</span>
                    </div>
                    <p className="text-sm font-black text-green-600 uppercase tracking-tight leading-none">Successful</p>
                 </div>
              </div>

              <button 
                onClick={() => navigate(`/donor/donation/${item.requestId?._id}`)}
                className="p-4 bg-gray-50 rounded-2xl hover:bg-[#4D9186] hover:text-white transition-all duration-300 flex items-center justify-center group/btn"
              >
                <ExternalLinkIcon className="w-6 h-6 transform group-hover/btn:scale-110 transition-transform" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-40 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-100">
             <HeartIcon className="w-20 h-20 text-gray-200 mx-auto mb-8" />
             <h3 className="text-2xl font-black text-gray-400 uppercase tracking-tighter">No Contributions Yet</h3>
             <p className="text-gray-400 font-bold mt-2 uppercase text-sm tracking-widest">Your kindness awaits its first mission.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDonations;