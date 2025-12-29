import React from 'react';
import { Lock, Eye, ShieldCheck, Database, Globe } from 'lucide-react';

const LegalPrivacy = () => {
  const lastUpdated = "December 22, 2025";

  const sections = [
    {
      icon: <Lock className="w-6 h-6 text-[#4D9186]" />,
      title: "Data Security",
      content: "We use industry-standard encryption to protect your personal and financial information. All medical documents are stored on secure servers and are only accessible by our verification team during the vetting process."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#4D9186]" />,
      title: "Sensitive Medical Data",
      content: "Medical reports provided by recipients are used solely for verification. While we show the case summary and patient name publicly to encourage donations, full medical records are never shared with third parties without explicit consent."
    },
    {
      icon: <Eye className="w-6 h-6 text-[#4D9186]" />,
      title: "Information We Collect",
      content: "We collect basic contact details from donors and detailed identification/medical data from recipients. We also collect transaction data for audit and transparency purposes as required by NGO governance laws."
    },
    {
      icon: <Database className="w-6 h-6 text-[#4D9186]" />,
      title: "Data Retention",
      content: "We retain donation records permanently for legal and audit compliance. Sensitive medical identifiers from successful campaigns are archived securely or anonymized after the treatment cycle is complete."
    },
    {
      icon: <Globe className="w-6 h-6 text-[#4D9186]" />,
      title: "Third-Party Sharing",
      content: "We do not sell your data. We only share necessary information with our payment processing partners (e.g., Razorpay/Stripe) and hospital verification partners when absolutely required for medical billing."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4D9186]/10 rounded-full text-[#4D9186] text-xs font-black uppercase tracking-widest mb-6">
            <Lock size={14} />
            Privacy First
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none mb-6">
            Privacy <span className="text-[#4D9186]">Policy</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 gap-6">
          {sections.map((section, index) => (
            <div 
              key={index}
              className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm hover:translate-y-[-2px] transition-all"
            >
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="p-4 bg-[#4D9186]/5 rounded-2xl flex-shrink-0">
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

        {/* Security Badge */}
        <div className="mt-16 p-8 border-2 border-dashed border-gray-200 rounded-[3rem] flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck size={32} />
            </div>
            <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">Safe & Transparent</h4>
            <p className="text-gray-400 text-sm font-bold max-w-sm mb-0">
                Your data is protected by industry-grade SSL encryption and secure medical storage protocols.
            </p>
        </div>
      </div>
    </div>
  );
};

export default LegalPrivacy;
