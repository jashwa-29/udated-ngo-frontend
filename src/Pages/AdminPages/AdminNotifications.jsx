import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BellIcon, CheckCircleIcon, CalendarIcon, TrashIcon, ExternalLinkIcon, InfoIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Skeleton from '../../Components/CommonComponents/Skeleton';
import ErrorState from '../../Components/CommonComponents/ErrorState';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/notifications`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setNotifications(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchNotifications();
    }
  }, [user?.token]);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/admin/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      toast.success('Marked as read');
    } catch (err) {
      toast.error('Failed to update notification');
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/admin/notifications/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success('Notification removed');
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationLink = (notification) => {
    const id = notification.relatedId?._id || notification.relatedId;
    if (!id) return null;

    switch (notification.onModel) {
      case 'DonationRequest':
        return `/admin/request/${id}`;
      case 'User':
        return `/admin/total-donors/donor/${id}`;
      case 'Contact':
        return `/admin/contacts`;
      default:
        return `/admin/request/${id}`;
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto mt-20">
        <div className="flex items-center gap-3 mb-8">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-48 h-8 rounded-lg" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 mt-20">
        <ErrorState 
          title="Notification Error"
          message={error}
          onRetry={fetchNotifications}
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto mt-20 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BellIcon className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>
        <div className="text-sm text-gray-500">
          Showing latest {notifications.length} alerts
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BellIcon className="w-8 h-8 text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No notifications yet</h2>
          <p className="text-gray-500 max-w-xs mx-auto">
            We'll notify you here when goals are achieved or new requests are submitted.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification._id}
              className={`group bg-white rounded-2xl p-6 border transition-all duration-300 hover:shadow-md ${
                notification.isRead ? 'border-gray-100 opacity-75' : 'border-primary/20 bg-primary/5 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                  notification.type === 'goal_achieved' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {notification.type === 'goal_achieved' ? <CheckCircleIcon className="w-5 h-5 md:w-6 md:h-6" /> : <InfoIcon className="w-5 h-5 md:w-6 md:h-6" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      {notification.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-gray-900 font-medium leading-relaxed mb-3">
                    {notification.message}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4">
                    {!notification.isRead && (
                      <button 
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors py-1"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        Mark read
                      </button>
                    )}
                    {getNotificationLink(notification) && (
                      <Link 
                        to={getNotificationLink(notification)}
                        className="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors py-1"
                      >
                        <ExternalLinkIcon className="w-4 h-4" />
                        Details
                      </Link>
                    )}
                    <button 
                      onClick={() => handleDeleteNotification(notification._id)}
                      className="ml-auto text-gray-400 hover:text-red-500 transition-colors p-2"
                      title="Delete Notification"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
