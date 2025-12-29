import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchAllRecipients, fetchAllDonors } from '../../API/Admin API/Homeapi';
import { fetchAllDonations } from '../../API/Admin API/donationApi';
import { useCurrency } from '../../context/CurrencyContext';
import { 
  Users, 
  Heart, 
  Trophy, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  DollarSign,
  Activity
} from 'lucide-react';
import Skeleton from '../../Components/CommonComponents/Skeleton';

const AdminHome = () => {
  const navigate = useNavigate();
  const { convert } = useCurrency();
  const [recipients, setRecipients] = useState([]);
  const [donors, setDonors] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [recipientsData, donorsData, donationsData] = await Promise.all([
          fetchAllRecipients(user.token),
          fetchAllDonors(user.token),
          fetchAllDonations()
        ]);
        
        setRecipients(Array.isArray(recipientsData) ? recipientsData : []);
        setDonors(Array.isArray(donorsData) ? donorsData : []);
        setDonations(Array.isArray(donationsData) ? donationsData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchData();
  }, [user?.token]);

  const stats = {
    totalRaised: donations.reduce((sum, d) => sum + (d.amount || 0), 0),
    totalDonations: donations.length,
    activeDonors: donors.length,
    approvedRequests: recipients.filter(r => r.status === 'approved').length,
    pendingRequests: recipients.filter(r => r.status === 'pending').length,
    achievedMissions: recipients.filter(r => r.status === 'achieved').length
  };

  if (loading) {
    return (
      <div className="p-8 mt-20 max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </div>
        <Skeleton className="h-[400px] rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 mt-16 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
          Admin <span className="text-[#4D9186]">Dashboard</span>
        </h1>
        <p className="text-sm md:text-base text-gray-500 font-medium">Platform overview and activity summary.</p>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
        <div className="bg-white p-5 md:p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 md:p-4 bg-emerald-50 rounded-2xl">
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Total Raised</p>
            <p className="text-xl md:text-2xl font-black text-gray-900">{convert(stats.totalRaised)}</p>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 md:p-4 bg-blue-50 rounded-2xl">
            <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Total Donors</p>
            <p className="text-xl md:text-2xl font-black text-gray-900">{stats.activeDonors}</p>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 md:p-4 bg-amber-50 rounded-2xl">
            <Clock className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Pending</p>
            <p className="text-xl md:text-2xl font-black text-gray-900">{stats.pendingRequests}</p>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 md:p-4 bg-purple-50 rounded-2xl">
            <Trophy className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Achieved</p>
            <p className="text-xl md:text-2xl font-black text-gray-900">{stats.achievedMissions}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-10">
        {/* Quick Actions / Featured Cards */}
        <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          <div className="bg-[#4D9186] p-6 md:p-8 rounded-[2rem] text-white shadow-xl shadow-[#4D9186]/20 relative overflow-hidden group">
            <Activity className="absolute -right-8 -bottom-8 w-40 h-40 opacity-10 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="text-lg md:text-xl font-bold mb-2">Approved Recipients</h3>
            <p className="text-3xl md:text-4xl font-black mb-6">{stats.approvedRequests}</p>
            <button 
              onClick={() => navigate('/admin/total-recipients')}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl font-bold transition-all flex items-center gap-2 group/btn text-sm"
            >
              Manage
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-[2rem] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Trophy className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Missions Completed</h3>
              </div>
              <p className="text-sm md:text-base text-gray-500 font-medium mb-6">
                Requests successfully reached their target.
              </p>
            </div>
            <button 
              onClick={() => navigate('/admin/achieved-requests')}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-[#4D9186] transition-all flex items-center justify-center gap-2 text-sm"
            >
              View Results
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Donations Table */}
          <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 md:p-8 border-b border-gray-50 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">Recent Donations</h3>
              </div>
              <Link to="/admin/donations" className="text-xs md:text-sm font-bold text-[#4D9186] hover:underline">View All</Link>
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left font-medium">
                <thead>
                  <tr className="text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-50 bg-gray-50/50">
                    <th className="px-8 py-4">Donor</th>
                    <th className="px-4 py-4">Patient</th>
                    <th className="px-4 py-4">Amount</th>
                    <th className="px-8 py-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {donations.slice(0, 5).map((donation) => (
                    <tr key={donation._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-4">
                        <div className="text-gray-900 font-bold">{donation.donorId?.username}</div>
                        <div className="text-[10px] text-gray-400">{donation.donorId?.email}</div>
                      </td>
                      <td className="px-4 py-4 text-gray-600 text-sm italic">
                        {donation.requestId?.patientname}
                      </td>
                      <td className="px-4 py-4 font-black text-[#4D9186]">
                        {convert(donation.amount)}
                      </td>
                      <td className="px-8 py-4 text-right text-gray-400 text-xs">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-50">
              {donations.slice(0, 5).map((donation) => (
                <div key={donation._id} className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{donation.donorId?.username}</p>
                      <p className="text-[10px] text-gray-400">{donation.donorId?.email}</p>
                    </div>
                    <p className="text-sm font-black text-[#4D9186]">{convert(donation.amount)}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] text-gray-500 italic">For: {donation.requestId?.patientname}</p>
                    <p className="text-[10px] text-gray-400">{new Date(donation.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {donations.length === 0 && (
              <div className="px-8 py-20 text-center text-gray-400">
                No recent donations found.
              </div>
            )}
          </div>

          {/* Pending Requests Section */}
          <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden flex flex-col relative">
            {/* Subtle Amber Accent for "To-Do" status */}
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 opacity-50" />
            
            <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between bg-white gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">Review Queue</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Awaiting attention</p>
                </div>
              </div>
              <Link to="/admin/requests" className="text-xs md:text-sm font-bold text-[#4D9186] hover:underline flex items-center gap-1">
                Manage All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="p-5">
              {recipients.filter(r => r.status === 'pending').length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-gray-900">All Clear!</p>
                    <p className="text-sm text-gray-500 font-medium">There are no pending requests to review.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {recipients
                    .filter(r => r.status === 'pending')
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 4)
                    .map((request) => {
                      const isNew = new Date() - new Date(request.createdAt) < 24 * 60 * 60 * 1000;
                      const timeAgo = () => {
                        const seconds = Math.floor((new Date() - new Date(request.createdAt)) / 1000);
                        if (seconds < 60) return 'Just now';
                        if (seconds < 3600) return `${Math.floor(seconds/60)}m ago`;
                        if (seconds < 86400) return `${Math.floor(seconds/3600)}h ago`;
                        return `${Math.floor(seconds/86400)}d ago`;
                      };

                      return (
                        <div key={request._id} className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 rounded-[2rem] bg-gray-50 border border-gray-100 hover:border-amber-200 hover:bg-white hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-300 gap-4">
                          <div className="flex items-center gap-4">
                            <div className="relative flex-shrink-0">
                              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center font-black text-gray-400 shadow-sm group-hover:scale-110 transition-transform">
                                {request.patientname?.charAt(0)}
                              </div>
                              {isNew && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <p className="font-black text-gray-900 tracking-tight">{request.patientname}</p>
                                {isNew && (
                                  <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[8px] font-black uppercase tracking-tighter rounded-full">New</span>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                <p className="text-[10px] text-gray-500 font-bold">{request.medicalproblem}</p>
                                <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                <p className="text-[10px] text-amber-600 font-black">{convert(request.donationamount)}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                              {timeAgo()}
                            </span>
                            <Link 
                              to={`/admin/request/${request._id}`}
                              className="px-5 py-2.5 bg-white border border-gray-200 text-gray-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#4D9186] hover:text-white hover:border-[#4D9186] shadow-sm transition-all"
                            >
                              Review
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  
                  {recipients.filter(r => r.status === 'pending').length > 4 && (
                    <div className="pt-2 text-center">
                      <Link 
                        to="/admin/requests"
                        className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] hover:text-[#4D9186] transition-colors"
                      >
                        + {recipients.filter(r => r.status === 'pending').length - 4} More in queue
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

