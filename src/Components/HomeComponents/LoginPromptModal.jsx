import React from 'react';

const LoginPromptModal = ({ isOpen, onClose, onLogin}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
          You must be logged in as a donor to donate
        </h2>

        <div className="flex flex-col gap-4">
          <button
            onClick={onLogin}
            className="bg-[#4D9186] text-white py-2 rounded hover:bg-[#097256]"
          >
            Login / Register as Donor
          </button>
       
        </div>

        <button
          onClick={onClose}
          className="mt-4 block mx-auto text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LoginPromptModal;
