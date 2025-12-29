import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XIcon, HeartIcon, ShieldCheckIcon } from 'lucide-react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../PaymentComponents/CheckoutForm';

// Initialize Stripe
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
console.log("Stripe Publishable Key found:", !!stripeKey);
const stripePromise = loadStripe(stripeKey);

const DonationModal = ({ isOpen, onClose, onSubmit, card }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const [exchangeRate, setExchangeRate] = useState(83.50);
  const [step, setStep] = useState(1); // 1: Amount, 2: Payment
  const [clientSecret, setClientSecret] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const convertedINR = amount ? (currency === 'USD' ? amount * exchangeRate : amount) : 0;

  // Fetch live rate for preview
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await axios.get('https://api.frankfurter.app/latest?from=USD&to=INR');
        if (response.data?.rates?.INR) {
          setExchangeRate(response.data.rates.INR);
        }
      } catch (err) {
        console.error("Failed to fetch live rate for preview:", err);
      }
    };
    if (isOpen && step === 1) fetchRate();
  }, [isOpen, step]);

  // Reset state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setAmount('');
      setMessage('');
      setClientSecret("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) return;
    
    setIsSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/payment/create-intent`,
        {
          requestId: card.id || card._id,
          amount: parseFloat(amount),
          currency: currency,
          message: message
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data?.clientSecret) {
        console.log("Payment Intent created successfully");
        setClientSecret(response.data.clientSecret);
        setStep(2);
      }
    } catch (error) {
      console.error('Failed to create payment intent:', error);
      alert(error.response?.data?.message || 'Failed to initialize payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#4D9186',
      borderRadius: '24px',
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden transform transition-all duration-500 animate-in fade-in zoom-in slide-in-from-bottom-8">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors z-10"
        >
          <XIcon className="w-6 h-6" />
        </button>

        {step === 1 && (
          <div className="p-10 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-red-50 rounded-2xl">
                <HeartIcon className="w-8 h-8 text-red-500 fill-red-500" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Support This Cause</h2>
                <p className="text-gray-500 font-medium">Your donation makes a real difference</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-100">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Active Case</span>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{card.patientname}</h3>
              <p className="text-sm text-gray-500 font-bold mt-1 line-clamp-1 italic">"{card.medicalproblem}"</p>
            </div>

            <form onSubmit={handleInitialSubmit} className="space-y-6">
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-3 px-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-3xl text-sm font-black text-gray-900 focus:outline-none focus:border-[#4D9186] transition-all"
                  >
                    <option value="INR">🇮🇳 INR (Indian Rupee)</option>
                    <option value="USD">🇺🇸 USD (US Dollar)</option>
                  </select>
                </div>
                <div className="flex-[2]">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-3 px-1">
                    Amount ({currency})
                  </label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-400">
                      {currency === 'USD' ? '$' : '₹'}
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount..."
                      className="w-full pl-12 pr-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-3xl text-2xl font-black text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#4D9186] focus:bg-white transition-all shadow-inner"
                      required
                    />
                  </div>
                </div>
              </div>

              {currency === 'USD' && amount > 0 && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mb-6 animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-emerald-700">
                    <span>Est. Conversion</span>
                    <span>1 USD ≈ {exchangeRate} INR</span>
                  </div>
                  <div className="text-xl font-black text-emerald-900 mt-1">
                    ≈ ₹{Math.round(convertedINR).toLocaleString()} INR
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-3 px-1">Message (Optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Words of encouragement..."
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-3xl text-gray-900 font-bold placeholder:text-gray-300 focus:outline-none focus:border-[#4D9186] focus:bg-white transition-all shadow-inner resize-none h-24"
                />
              </div>

              <div className="flex items-center gap-3 bg-[#4D9186]/5 p-4 rounded-2xl border border-[#4D9186]/10 mb-2">
                <ShieldCheckIcon className="w-5 h-5 text-[#4D9186]" />
                <span className="text-[10px] font-black text-[#4D9186] uppercase tracking-widest">Secure 256-bit encrypted transaction</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-[#4D9186] text-white rounded-3xl font-black uppercase tracking-widest hover:bg-[#3d746b] transition-all shadow-xl shadow-[#4D9186]/20 active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? 'Initializing...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>
        )}

        {step === 2 && clientSecret && (
          <div className="p-10 md:p-12">
             <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <ShieldCheckIcon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Enter Details</h2>
                <p className="text-gray-500 font-medium">Complete your secure contribution</p>
              </div>
            </div>
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm amount={amount} currency={currency} />
            </Elements>
            <button 
              onClick={() => setStep(1)}
              className="w-full mt-4 py-3 text-gray-400 font-bold uppercase tracking-widest text-xs hover:text-gray-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationModal;
