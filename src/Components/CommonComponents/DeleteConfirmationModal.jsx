import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Deletion", 
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  isLoading = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={!isLoading ? onClose : undefined} 
      />
      
      {/* Modal Container */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-md relative z-10 shadow-2xl transform transition-all animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
            <AlertTriangle className="w-10 h-10" />
          </div>
          
          <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
            {title}
          </h2>
          
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            {message}
          </p>

          <div className="flex gap-4 w-full">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-4 bg-gray-50 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all disabled:opacity-50 active:scale-95"
            >
              No, Keep it
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Yes, Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
