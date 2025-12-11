import React from 'react';

const DonationModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = e.target.amount.value;
    if (!amount) return;
    launchRazorpay(amount);
  };

  const launchRazorpay = (amount) => {
    const options = {
      key: 'rzp_test_YourKeyHere', // Replace with your Razorpay Key ID
      amount: amount * 100, // Amount in paisa
      currency: 'INR',
      name: 'Swiflare NGO',
      description: 'Donation',
      image: '/logo.png', // optional logo
      handler: function (response) {
        // Send response to server or show success
        console.log('Payment successful:', response);
        onSubmit(amount); // You can log/store the donation here
        onClose(); // Close modal after successful donation
      },
      prefill: {
        name: '',
        email: '',
        contact: '',
      },
      theme: {
        color: '#4D9186',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Donation Form</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            name="amount"
            placeholder="Enter amount"
            className="w-full mb-4 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-[#4D9186] text-white px-4 py-2 rounded hover:bg-[#097256] w-full"
          >
            Donate with Razorpay
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DonationModal;
