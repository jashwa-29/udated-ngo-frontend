import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, XIcon, SparklesIcon, HeartIcon } from 'lucide-react';

const SuccessPaymentModal = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center px-4 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop with extreme blur and dark gradient */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-2xl transition-all duration-700"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className={`relative bg-white w-full max-w-lg rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.25)] overflow-hidden transform transition-all duration-700 delay-100 flex flex-col items-center text-center ${isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-12'}`}>
        
        {/* Animated Background Decoration */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-[#4D9186]/20 to-emerald-50/10 pointer-events-none overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#4D9186]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2.5 rounded-full bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-white hover:shadow-lg transition-all z-10 active:scale-95"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="p-12 md:p-16 relative">
          {/* Main Icon with complex layers */}
          <div className="relative mb-10 inline-block">
            <div className="absolute inset-0 bg-emerald-100 rounded-[2.5rem] blur-2xl animate-pulse scale-150 opacity-50"></div>
            <div className="relative w-32 h-32 bg-gradient-to-br from-[#4D9186] to-[#3d746b] rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-[#4D9186]/40 transform hover:rotate-6 transition-transform">
              <CheckCircleIcon className="w-16 h-16 text-white" strokeWidth={2.5} />
              
              {/* Accessory Icons Orbiting */}
              <div className="absolute -top-2 -right-2 bg-white p-2.5 rounded-2xl shadow-xl animate-bounce delay-200">
                <SparklesIcon className="w-5 h-5 text-[#4D9186]" />
              </div>
              <div className="absolute -bottom-2 -left-2 bg-white p-2.5 rounded-2xl shadow-xl animate-bounce">
                <HeartIcon className="w-5 h-5 text-red-500 fill-red-500" />
              </div>
            </div>
          </div>

          {/* Success Messaging */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Glorious <span className="text-[#4D9186]">Impact!</span>
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-[#4D9186] to-emerald-200 mx-auto rounded-full"></div>
            <p className="text-gray-500 font-bold text-lg mt-6 leading-relaxed">
              Your donation has been <span className="text-gray-900">successfully processed</span> through Stripe. High-fives all around! 🙌
            </p>
          </div>

          {/* Impact Placeholder Box */}
          <div className="mt-10 p-6 bg-gray-50 rounded-[2rem] border border-gray-100 text-left relative group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#4D9186]">
                <HeartIcon className="w-6 h-6 fill-[#4D9186]" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lives Touched</p>
                <p className="text-lg font-black text-gray-900 uppercase tracking-tight">One Heartbeat Stronger</p>
              </div>
            </div>
            <div className="absolute top-1/2 right-6 -translate-y-1/2 text-primary opacity-20 group-hover:opacity-100 transition-opacity">
               <SparklesIcon className="w-8 h-8" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 space-y-4">
            <button
              onClick={onClose}
              className="w-full py-6 bg-[#4D9186] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-[#3d746b] hover:shadow-[0_20px_40px_rgba(77,145,134,0.3)] transition-all active:scale-[0.98] shadow-xl shadow-[#4D9186]/10"
            >
              Continue Healing
            </button>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              A official receipt has been sent to your email
            </p>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="w-full py-5 bg-gray-50/50 border-t border-gray-50">
           <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Verified Secure by Stripe & Swiflare</p>
        </div>
      </div>

      {/* Floating Sparkles Backdrop Decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-[201]">
         {[...Array(6)].map((_, i) => (
           <div 
             key={i}
             className="absolute animate-pulse hidden md:block"
             style={{
               top: `${Math.random() * 100}%`,
               left: `${Math.random() * 100}%`,
               animationDelay: `${Math.random() * 2}s`,
               opacity: 0.2
             }}
           >
             <SparklesIcon className="w-8 h-8 text-[#4D9186]" />
           </div>
         ))}
      </div>
    </div>
  );
};

export default SuccessPaymentModal;
