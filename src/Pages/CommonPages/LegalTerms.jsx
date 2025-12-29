import React from 'react';
import { ShieldCheck, FileText, Scale, HelpCircle, CheckCircle2 } from 'lucide-react';

const LegalTerms = () => {
  const lastUpdated = "December 22, 2025";

  const sections = [
    {
      icon: <FileText className="w-6 h-6 text-[#4D9186]" />,
      title: "1. Acceptance of Terms",
      content: "By accessing and using our platform, you agree to comply with and be bound by these Terms and Conditions. Our platform connects donors with verified medical cases. If you do not agree with any part of these terms, please refrain from using our services."
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-[#4D9186]" />,
      title: "2. Verification Policy",
      content: "We take medical verification seriously. Every campaign on our platform undergoes a rigorous multi-step verification process, including hospital document checks and identity validation. However, donors are encouraged to exercise their own discretion."
    },
    {
      icon: <Scale className="w-6 h-6 text-[#4D9186]" />,
      title: "3. Donation & Refund Policy",
      content: "Donations once made are generally non-refundable as they are directly allocated to critical medical treatments. In the rare case of a technical error or duplicate transaction, please contact our support team within 48 hours for review."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#4D9186]" />,
      title: "4. Transparency & Fees",
      content: "Our organization is committed to 100% transparency. While we strive to pass 100% of the donation to the recipient, minor platform processing fees (e.g., bank or gateway charges) may apply depending on the payment method used."
    },
    {
      icon: <HelpCircle className="w-6 h-6 text-[#4D9186]" />,
      title: "5. User Responsibilities",
      content: "Users (Donors and Recipients) must provide accurate information. Misrepresentation of medical conditions or identity is a serious offense and will lead to immediate account termination and potential legal action."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4D9186]/10 rounded-full text-[#4D9186] text-xs font-black uppercase tracking-widest mb-6">
            <Scale size={14} />
            Legal Agreement
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none mb-6">
            Terms & <span className="text-[#4D9186]">Conditions</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Content Cards */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div 
              key={index}
              className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-6">
                <div className="p-4 bg-gray-50 rounded-2xl flex-shrink-0">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-4 tracking-tight uppercase">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed font-medium">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support CTA */}
        <div className="mt-16 bg-gray-900 rounded-[3rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4D9186]/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <h3 className="text-2xl font-black mb-4 relative z-10">Have questions about our terms?</h3>
          <p className="text-gray-400 font-medium mb-8 max-w-lg mx-auto relative z-10">
            Our legal and support teams are here to help you understand how we protect donors and recipients.
          </p>
          <button className="bg-[#4D9186] hover:bg-[#3d746b] px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-colors relative z-10 shadow-xl shadow-[#4D9186]/20">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalTerms;
