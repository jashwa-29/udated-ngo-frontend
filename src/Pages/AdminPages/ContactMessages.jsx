import React, { useEffect, useState } from 'react';
import { 
  Mail, 
  Trash2, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  Search, 
  Filter,
  MoreVertical,
  Calendar,
  Phone,
  Building2,
  User,
  Inbox
} from 'lucide-react';
import { 
  fetchAllMessages, 
  updateMessageStatus, 
  deleteContactMessage 
} from '../../API/ContactAPI';
import { toast } from 'react-hot-toast';
import Skeleton from '../../Components/CommonComponents/Skeleton';
import DeleteConfirmationModal from '../../Components/CommonComponents/DeleteConfirmationModal';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, read, unread
  const [searchTerm, setSearchTerm] = useState('');
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({ 
    isOpen: false, 
    id: null, 
    isLoading: false 
  });

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await fetchAllMessages(user.token);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      loadMessages();
    }
  }, [user?.token]);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await updateMessageStatus(user.token, id, !currentStatus);
      setMessages(messages.map(msg => 
        msg._id === id ? { ...msg, isRead: !currentStatus } : msg
      ));
      toast.success(`Marked as ${!currentStatus ? 'read' : 'unread'}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    setDeleteModal({ isOpen: true, id: id, isLoading: false });
  };

  const confirmDelete = async () => {
    const id = deleteModal.id;
    try {
      setDeleteModal(prev => ({ ...prev, isLoading: true }));
      await deleteContactMessage(user.token, id);
      setMessages(messages.filter(msg => msg._id !== id));
      toast.success('Message deleted');
      setDeleteModal({ isOpen: false, id: null, isLoading: false });
    } catch (error) {
      toast.error('Failed to delete message');
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesFilter = 
      filter === 'all' ? true : 
      filter === 'read' ? msg.isRead : !msg.isRead;
    
    const matchesSearch = 
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-8 mt-16 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-1/4 rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 mt-16 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Inbox className="w-8 h-8 text-[#4D9186]" />
            Contact <span className="text-[#4D9186]">Messages</span>
          </h1>
          <p className="text-gray-500 font-medium">Manage inquiries from the contact form.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4D9186]/20 focus:border-[#4D9186] transition-all w-full md:w-64"
            />
          </div>

          <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1">
            {['all', 'unread', 'read'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  filter === f 
                    ? 'bg-[#4D9186] text-white shadow-lg shadow-[#4D9186]/20' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          label="Total Inquiries" 
          value={messages.length} 
          icon={Mail} 
          color="blue"
        />
        <StatCard 
          label="Unread" 
          value={messages.filter(m => !m.isRead).length} 
          icon={EyeOff} 
          color="amber"
        />
        <StatCard 
          label="Read" 
          value={messages.filter(m => m.isRead).length} 
          icon={Eye} 
          color="emerald"
        />
        <StatCard 
          label="Filtered" 
          value={filteredMessages.length} 
          icon={Filter} 
          color="purple"
        />
      </div>

      {/* Desktop Table View */}
      <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden hidden lg:block">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contact</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Company</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Message Preview</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredMessages.map((msg) => (
              <tr 
                key={msg._id} 
                className={`hover:bg-gray-50/80 transition-colors group ${!msg.isRead ? 'bg-emerald-50/10' : ''}`}
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                      !msg.isRead ? 'bg-[#4D9186]/10 text-[#4D9186]' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {msg.name.charAt(0)}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${!msg.isRead ? 'text-gray-900 font-black' : 'text-gray-700'}`}>
                        {msg.name}
                      </p>
                      <p className="text-xs text-gray-400">{msg.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-gray-300" />
                    {msg.company || 'N/A'}
                  </p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-gray-500 line-clamp-1 max-w-xs">{msg.message}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(msg.createdAt).toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    msg.isRead 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'bg-amber-50 text-amber-600 animate-pulse'
                  }`}>
                    {msg.isRead ? 'Read' : 'New'}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleStatus(msg._id, msg.isRead)}
                      title={msg.isRead ? "Mark as unread" : "Mark as read"}
                      className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-[#4D9186] transition-all"
                    >
                      {msg.isRead ? <EyeOff className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="p-2 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 text-gray-400 hover:text-red-600 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredMessages.length === 0 && <EmptyState />}
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredMessages.map((msg) => (
          <div 
            key={msg._id} 
            className={`bg-white p-6 rounded-[2rem] border transition-all ${
              !msg.isRead ? 'border-[#4D9186] shadow-xl shadow-[#4D9186]/5' : 'border-gray-100 shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${
                  !msg.isRead ? 'bg-[#4D9186] text-white shadow-lg shadow-[#4D9186]/20' : 'bg-gray-100 text-gray-400'
                }`}>
                  {msg.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-gray-900 tracking-tight">{msg.name}</h3>
                  <p className="text-xs text-gray-400">{msg.email}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                msg.isRead ? 'bg-gray-50 text-gray-400' : 'bg-amber-100 text-amber-600'
              }`}>
                {msg.isRead ? 'Read' : 'New'}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Phone className="w-3.5 h-3.5 text-[#4D9186]" />
                {msg.phone}
              </div>
              {msg.company && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Building2 className="w-3.5 h-3.5 text-[#4D9186]" />
                  {msg.company}
                </div>
              )}
              <div className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 p-4 rounded-2xl italic">
                "{msg.message}"
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(msg.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleStatus(msg._id, msg.isRead)}
                  className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#4D9186] hover:text-white transition-all"
                >
                  {msg.isRead ? 'Mark New' : 'Mark Read'}
                </button>
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredMessages.length === 0 && <EmptyState />}
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        isLoading={deleteModal.isLoading}
        onClose={() => setDeleteModal({ isOpen: false, id: null, isLoading: false })}
        onConfirm={confirmDelete}
        title="Delete Message"
        message="Are you sure you want to delete this inquiry? This action will permanently remove it from your records."
      />
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-2xl ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="py-20 text-center space-y-4">
    <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-[2.5rem] flex items-center justify-center mx-auto">
      <Inbox className="w-10 h-10" />
    </div>
    <div>
      <p className="text-xl font-black text-gray-900 tracking-tight">No messages found</p>
      <p className="text-sm text-gray-500 font-medium">Clear your filters or check back later.</p>
    </div>
  </div>
);

export default ContactMessages;
