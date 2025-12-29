import React, { useState, useEffect } from 'react';
import { fetchAllDonations } from '../../API/Admin API/donationApi';
import { useCurrency } from '../../context/CurrencyContext';
import { Search, Heart, User, Calendar, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const DonationsHistory = () => {
    const [donations, setDonations] = useState([]);
    const [filteredDonations, setFilteredDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { convert } = useCurrency();

    useEffect(() => {
        const loadDonations = async () => {
            try {
                setLoading(true);
                const data = await fetchAllDonations();
                setDonations(data || []);
                setFilteredDonations(data || []);
            } catch (err) {
                console.error('Error fetching donations:', err);
                setError('Failed to fetch donation history');
            } finally {
                setLoading(false);
            }
        };
        loadDonations();
    }, []);

    useEffect(() => {
        const results = donations.filter(donation => 
            donation.donorId?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donation.requestId?.patientname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donation.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredDonations(results);
    }, [searchTerm, donations]);

    const stats = {
        totalAmount: donations.reduce((sum, d) => sum + (d.amount || 0), 0),
        count: donations.length,
        uniqueDonors: new Set(donations.map(d => d.donorId?._id)).size
    };

    if (loading) return <div className="p-8 text-center">Loading Donation History...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Donation History</h1>
                    <p className="text-gray-500">Monitor all contributions across the platform</p>
                </div>
                
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search donors, patients, or transactions..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-[#4D9186]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                        <CreditCard className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Raised</p>
                        <p className="text-2xl font-bold text-gray-900">{convert(stats.totalAmount)}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <Heart className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Donations</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.count}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-purple-50 rounded-lg">
                        <User className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Unique Donors</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.uniqueDonors}</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            {/* Desktop View */}
            <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Donor</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction ID</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDonations.length > 0 ? (
                                filteredDonations.map((donation) => (
                                    <tr key={donation._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900">{donation.donorId?.username}</div>
                                            <div className="text-[10px] text-gray-400 uppercase tracking-widest">{donation.donorId?.email}</div>
                                        </td>
                                        <td className="p-4 text-gray-700">
                                            {donation.requestId ? (
                                                <Link 
                                                    to={`/admin/request/${donation.requestId._id}`}
                                                    className="text-sm hover:text-[#4D9186] hover:underline font-bold"
                                                >
                                                    {donation.requestId.patientname}
                                                </Link>
                                            ) : 'N/A'}
                                        </td>
                                        <td className="p-4 text-right font-black text-[#4D9186]">
                                            {convert(donation.amount)}
                                        </td>
                                        <td className="p-4 text-xs text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-300" />
                                                {new Date(donation.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4 text-[10px] font-mono text-gray-400">
                                            {donation.transactionId}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                donation.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 
                                                donation.status === 'failed' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                                {donation.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500 font-medium">No donations found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden space-y-4">
                {filteredDonations.length > 0 ? (
                    filteredDonations.map((donation) => (
                        <div key={donation._id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Donor</p>
                                    <p className="font-black text-gray-900">{donation.donorId?.username}</p>
                                    <p className="text-[10px] text-gray-400 truncate max-w-[150px]">{donation.donorId?.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount</p>
                                    <p className="text-lg font-black text-[#4D9186]">{convert(donation.amount)}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Patient</p>
                                    {donation.requestId ? (
                                        <Link 
                                            to={`/admin/request/${donation.requestId._id}`}
                                            className="text-xs font-bold text-gray-700 hover:text-[#4D9186]"
                                        >
                                            {donation.requestId.patientname}
                                        </Link>
                                    ) : <span className="text-xs text-gray-400">N/A</span>}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
                                    <p className="text-xs font-bold text-gray-700">{new Date(donation.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Id</p>
                                    <p className="text-[10px] font-mono text-gray-400 truncate">{donation.transactionId}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    donation.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 
                                    donation.status === 'failed' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                }`}>
                                    {donation.status}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-12 rounded-[2rem] text-center text-gray-400 font-bold border border-dashed border-gray-200">
                        No donations found
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonationsHistory;
