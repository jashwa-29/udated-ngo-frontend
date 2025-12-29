import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Trophy, 
  Search, 
  ArrowLeft, 
  ChevronRight,
  Target,
  Users,
  User,
  Calendar,
  DollarSign,
  Heart,
  Activity,
  Award
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import Skeleton from '../../Components/CommonComponents/Skeleton';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AchievedRequests = () => {
  const { convert } = useCurrency();
  const [recipients, setRecipients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/admin/GetAllDonationRequest`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        
        const responseData = response.data.data || [];
        // Filter ONLY achieved missions here
        const achievedData = responseData
          .filter(item => item.status === 'achieved')
          .map(item => ({
            id: item._id,
            name: item.patientname,
            problem: item.medicalproblem,
            amount: item.donationamount,
            createdAt: item.createdAt,
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Success Date Unknown',
            userInfo: item.userId || {}
          }));
        
        setRecipients(achievedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching achieved requests:', err);
        setError('Failed to load successful missions');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.token) fetchData();
  }, [user?.token]);

  const filteredMissions = useMemo(() => {
    return recipients
      .filter(r => 
        r.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.problem?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [recipients, searchQuery]);

  const totalImpact = useMemo(() => {
    return recipients.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
  }, [recipients]);

  if (isLoading) return (
    <div className="p-4 md:p-8 mt-16 max-w-7xl mx-auto space-y-8">
      <Skeleton className="w-64 h-12 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-[2.5rem]" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 rounded-[2.5rem]" />)}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 mt-16 max-w-7xl mx-auto min-h-screen">
      {/* Back Navigation */}
      <Link 
        to="/admin/dashboard" 
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-black uppercase tracking-widest text-[10px] mb-8 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      {/* Header & Success Stats */}
      <div className="mb-12 space-y-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
              <Trophy size={20} className="md:w-6 md:h-6" />
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              Achieved <span className="text-emerald-600">Missions</span>
            </h1>
          </div>
          <p className="text-sm md:text-lg text-gray-500 font-medium">Celebrating every life changed and goal reached.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-emerald-600 p-6 md:p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-900/10 flex flex-col justify-between group overflow-hidden relative">
            <Award className="absolute -right-4 -bottom-4 w-24 md:w-32 h-24 md:h-32 opacity-10 group-hover:scale-110 transition-transform duration-500" />
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-1">Missions Accomplished</p>
            <p className="text-4xl md:text-5xl font-black">{recipients.length}</p>
          </div>
          
          <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Impact Created</p>
              <p className="text-3xl md:text-4xl font-black text-gray-900">{convert(totalImpact)}</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase mt-4">
              <Activity size={14} /> 
              100% Funding Success
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-3 rounded-[2.5rem] shadow-sm flex items-center col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex-1 px-4 md:px-5">
               <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Search Success Stories</p>
               <div className="relative">
                 <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                 <input 
                  type="text" 
                  placeholder="Patient or condition..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-6 py-2 bg-transparent border-none focus:ring-0 text-xs md:text-sm font-bold text-gray-900 placeholder:text-gray-200"
                 />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Success Cards */}
      {filteredMissions.length === 0 ? (
        <div className="py-32 text-center bg-gray-50 border border-dashed border-gray-200 rounded-[3rem]">
          <Target size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-xl font-black text-gray-400">No matching success stories</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMissions.map((item) => (
            <Link
              key={item.id}
              to={`/admin/request/${item.id}`}
              className="group bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[4rem] -mr-8 -mt-8 group-hover:bg-emerald-100 transition-colors" />
              <Trophy className="absolute top-6 right-6 text-emerald-500 opacity-20 group-hover:opacity-40 transition-opacity" size={24} />

              <div className="mb-8">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-3 inline-block">Goal Achieved</span>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-tight group-hover:text-emerald-600 transition-colors">{item.name}</h3>
                <p className="text-gray-400 text-xs font-bold mt-1">Case #{item.id.slice(-6)} • {item.date}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                    <Heart size={16} />
                  </div>
                  <p className="text-sm font-bold text-gray-600 line-clamp-1">{item.problem}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                    <DollarSign size={16} />
                  </div>
                  <p className="text-lg font-black text-gray-900 tracking-tight">{convert(item.amount)} <span className="text-[10px] text-gray-400 font-bold uppercase ml-1">Raised</span></p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                       <User size={14} className="text-gray-300" />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-500 flex items-center justify-center text-[10px] font-black text-white">
                    99+
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-gray-900 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                  Case Review
                  <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AchievedRequests;
