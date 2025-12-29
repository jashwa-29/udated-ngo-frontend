import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { ShieldCheckIcon, AlertCircleIcon } from 'lucide-react';

const CheckoutForm = ({ amount, currency, onEmailSet }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (stripe) {
      console.log("Stripe.js has loaded successfully");
    } else if (elements) {
      console.warn("Stripe Elements found but Stripe.js is missing");
    }
  }, [stripe, elements]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL where the customer will be redirected after payment
        return_url: `${window.location.origin}/receivers?payment_success=true`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      console.error("Stripe Checkout Error:", error);
      setMessage(error.message || "An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="relative min-h-[150px]">
        <PaymentElement 
          id="payment-element" 
          options={{ layout: 'tabs' }} 
          onReady={() => console.log("Stripe Element Ready")}
        />
        {!stripe && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-center p-6">
              <div className="w-8 h-8 border-4 border-[#4D9186]/30 border-t-[#4D9186] rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Secure Vault...</p>
            </div>
          </div>
        )}
      </div>
      
      {message && (
        <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-700 text-sm font-bold animate-in fade-in slide-in-from-top-2">
           <AlertCircleIcon className="w-5 h-5 flex-shrink-0" />
           <span>{message}</span>
        </div>
      )}

      <div className="flex items-center gap-3 bg-[#4D9186]/5 p-4 rounded-2xl border border-[#4D9186]/10">
        <ShieldCheckIcon className="w-5 h-5 text-[#4D9186]" />
        <span className="text-[10px] font-black text-[#4D9186] uppercase tracking-widest">
          Secure encrypted payment of {currency === 'USD' ? '$' : '₹'}{amount}
        </span>
      </div>

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full py-5 bg-[#4D9186] text-white rounded-3xl font-black uppercase tracking-widest hover:bg-[#3d746b] transition-all shadow-xl shadow-[#4D9186]/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span id="button-text">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : (
            `Pay ${currency === 'USD' ? '$' : '₹'}${amount} Now`
          )}
        </span>
      </button>
    </form>
  );
};

export default CheckoutForm;
