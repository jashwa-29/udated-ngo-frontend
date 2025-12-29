import React, { useEffect, useState } from "react";
import { fetchAllRecipients } from "../../API/Admin API/recipientApi";
import { useCurrency } from "../../context/CurrencyContext";
import { Link } from "react-router-dom";
import { Search, Filter, ChevronRight } from "lucide-react";

const TotalRecipients = () => {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, approved, pending, rejected
  const [searchTerm, setSearchTerm] = useState("");
  
  const { convert } = useCurrency();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchAllRecipients(user.token);
        setRecipients(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading recipients:", err);
        setError("Failed to load recipients");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) loadData();
  }, [user?.token]);

  const filteredRecipients = recipients.filter(r => {
    const matchesFilter = filter === "all" || r.status === filter;
    const matchesSearch = r.patientname?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.medicalproblem?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return (
    <div className="flex justify-center items-center h-60">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4D9186]"></div>
    </div>
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 mt-16 md:mt-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Recipients <span className="text-[#4D9186]">Management</span></h1>
          <p className="text-sm text-gray-500 font-medium">View and manage all donation requests</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D9186]/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {['all', 'approved', 'pending', 'rejected'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${
                  filter === f ? 'bg-white text-[#4D9186] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error ? (
        <div className="p-6 text-red-500 bg-red-50 rounded-lg border border-red-100">{error}</div>
      ) : filteredRecipients.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 text-lg">No recipients found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipients.map((recipient) => (
            <div 
              key={recipient._id} 
              className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    recipient.status === 'approved' ? 'bg-green-100 text-green-700' :
                    recipient.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {recipient.status}
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date(recipient.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-1">{recipient.patientname}</h3>
                <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                  <span className="font-semibold text-gray-700">{recipient.age} yrs</span> • {recipient.gender}
                </p>
                
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Medical Condition</p>
                    <p className="text-sm text-gray-700 line-clamp-2">{recipient.medicalproblem}</p>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Target Amount</p>
                      <p className="text-xl font-black text-[#4D9186]">
                        {convert(recipient.donationamount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto p-4 bg-gray-50 border-t border-gray-100 italic text-xs text-gray-400 text-center">
                Contact: {recipient.number}
              </div>
              
              <Link 
                to={`/admin/request/${recipient._id}`}
                className="group flex items-center justify-center gap-2 py-4 bg-[#4D9186] text-white font-bold hover:bg-[#3d746b] transition-all"
              >
                View Details
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TotalRecipients;