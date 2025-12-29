import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

const ErrorState = ({ message, onRetry, title = "Something went wrong" }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-[2.5rem] border border-red-100 shadow-sm max-w-lg mx-auto my-10">
      <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 font-medium mb-8 leading-relaxed">
        {message || "We encountered an error while trying to fetch the data. Please try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-gray-900 hover:bg-[#4D9186] text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg active:scale-95"
        >
          <RefreshCcw className="w-5 h-5" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
