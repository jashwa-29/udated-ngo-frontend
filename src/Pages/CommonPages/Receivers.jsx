import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrency } from '../../context/CurrencyContext';
import axios from 'axios';
import { fetchAllDonationcard } from '../../API/Home API/AllDonations';
import { HeartIcon, AlertCircleIcon, ClockIcon, ChevronRightIcon, UsersIcon, TargetIcon, UserCircleIcon, StethoscopeIcon } from 'lucide-react';
import DonationModal from '../../Components/HomeComponents/DonationModal';
import SuccessPaymentModal from '../../Components/PaymentComponents/SuccessPaymentModal';
import { useSearchParams } from 'react-router-dom';

const Receivers = () => {
  const { convert } = useCurrency();
  const navigate = useNavigate();
  const [donationCards, setDonationCards] = useState([]);
  const [donationProgress, setDonationProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [user, setUser] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    setUser(loggedInUser);
    
    // Check for success parameter
    if (searchParams.get('payment_success') === 'true') {
      setShowSuccessAlert(true);
    }
  }, [searchParams]);

  const fetchDonationProgress = useCallback(async (card) => {
    try {
      const id = card.id || card._id;
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/Home/GetdonationStatus/${id}`
      );

      const goal = card.donationamount;
      const raised = Array.isArray(response.data) 
        ? response.data.reduce((total, donation) => total + (donation.amount || 0), 0)
        : 0;

      const percentage = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

      setDonationProgress((prev) => ({
        ...prev,
        [id]: { raised, percentage },
      }));
    } catch (error) {
      console.error('Error fetching donation amount:', error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await fetchAllDonationcard();
        const validData = Array.isArray(data) 
          ? data.filter(card => card.status === 'approved') 
          : [];
        setDonationCards(validData);

        // Fetch progress for all cards
        validData.forEach(card => fetchDonationProgress(card));
      } catch (error) {
        console.error('Error fetching donation cards:', error);
        setError('Failed to load donation recipients. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchDonationProgress]);

  const handleDonateClick = (card) => {
    if (user && user.role === 'DONOR') {
      setSelectedCard(card);
      setShowModal(true);
    } else {
      navigate('/donor-login');
    }
  };

  // Function to truncate long medical problems
  const truncateMedicalProblem = (text, maxLength = 40) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-12 w-64 bg-gray-200 rounded-xl mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-gray-100 h-[580px] animate-pulse overflow-hidden">
                <div className="h-64 m-3 rounded-[2.5rem] w-[calc(100%-1.5rem)] bg-gray-200"></div>
                <div className="p-8 space-y-4">
                  <div className="h-6 w-3/4 bg-gray-200 rounded-lg"></div>
                  <div className="h-4 w-full bg-gray-200 rounded-lg"></div>
                  <div className="h-20 w-full bg-gray-100 rounded-2xl mt-6"></div>
                  <div className="pt-8 space-y-4">
                     <div className="h-8 w-full bg-gray-200 rounded-2xl"></div>
                     <div className="h-12 w-full bg-gray-200 rounded-2xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md mx-auto">
            <AlertCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-3">Connection Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-28 lg:pt-36 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
              Active Recipients
            </h2>
            <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl font-heading">
              Hearts We <span className="text-primary">Heal Together</span>
            </h1>
            <p className="mt-4 text-lg text-gray-500 leading-relaxed max-w-xl">
              Meet the individuals who need our support. Each story represents a life waiting for compassionate intervention.
            </p>
          </div>
          
          <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UsersIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Active Cases</p>
                <p className="text-2xl font-bold text-primary">{donationCards.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {donationCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {donationCards.map((card, index) => {
              const id = card.id || card._id;
              const progress = donationProgress[id] || { raised: 0, percentage: 0 };
              const imageUrl = card.otherproof 
                ? `${import.meta.env.VITE_API_BASE_URL}/uploads/donation-requests/${card.otherproof}`
                : null;
              
              return (
                <div key={id} className="group bg-white/70 backdrop-blur-md rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-white/80 transition-all duration-500 hover:shadow-[0_25px_60px_rgba(77,145,134,0.15)] hover:-translate-y-2 overflow-hidden flex flex-col h-full active:scale-[0.98]">
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden rounded-[2.5rem] m-3 shadow-inner">
                    {imageUrl ? (
                      <>
                        <img
                          src={imageUrl}
                          alt={card.patientname}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      </>
                    ) : (
                      <div className="h-full w-full bg-emerald-50 flex items-center justify-center">
                        <HeartIcon className="w-16 h-16 text-emerald-200 animate-pulse" />
                      </div>
                    )}
                    
                    {/* Urgent Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-red-500/90 rounded-full backdrop-blur-md shadow-lg border border-red-400/30">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Urgent</span>
                      </div>
                    </div>

                    {/* Progress overlay on image */}
                    <div className="absolute bottom-5 left-6 right-6">
                      <div className="flex justify-between items-end mb-3">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Target Progress</p>
                          <p className="text-2xl font-black text-white">{progress.percentage.toFixed(0)}%</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Raised</p>
                          <p className="text-lg font-bold text-white">{convert(progress.raised)}</p>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                          style={{ width: `${progress.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-8 pb-8 pt-4 flex-1 flex flex-col">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest border border-primary/10">Medical Aid</span>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <ClockIcon className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-medium uppercase tracking-wider">Recently Added</span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-primary transition-colors duration-300">
                        {card.patientname}
                      </h3>
                    </div>

                    {/* Medical Problem */}
                    <div className="mb-6">
                      <div className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 transition-colors group-hover:bg-primary/5 group-hover:border-primary/10">
                        <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                           <StethoscopeIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Condition</p>
                          <p className="text-sm font-bold text-gray-800 leading-snug line-clamp-1">
                            {card.medicalproblem}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Description - Refined typography */}
                    <div className="mb-8 flex-1">
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                        {card.overview}
                      </p>
                    </div>

                    {/* Goal Section */}
                    <div className="space-y-6 pt-6 border-t border-dashed border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Funding Goal</p>
                          <p className="text-xl font-black text-gray-900">{convert(card.donationamount)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Needed</p>
                          <p className="text-xl font-black text-primary">{convert(Math.max(0, card.donationamount - progress.raised))}</p>
                        </div>
                      </div>

                      {/* Action Buttons - Massive primary button */}
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleDonateClick(card)}
                          className="flex-[4] py-4 bg-[#4D9186] text-white text-sm font-black rounded-2xl hover:bg-[#3d7a70] transition-all duration-300 shadow-[0_10px_25px_rgba(77,145,134,0.3)] hover:shadow-[0_15px_35px_rgba(77,145,134,0.4)] hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 uppercase tracking-widest"
                        >
                          Support Now
                          <ChevronRightIcon className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/case/${id}`}
                          className="flex-[1] bg-white border-2 border-gray-100 text-gray-400 hover:text-primary hover:border-primary transition-all duration-300 rounded-2xl flex items-center justify-center hover:bg-primary/5 active:scale-95"
                          title="Detailed Case Study"
                        >
                          <AlertCircleIcon className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-400 mb-3">No Active Cases</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              There are currently no active donation requests. Please check back later or contact us to learn more about upcoming opportunities.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark group"
            >
              Contact Us
              <ChevronRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

       
      </div>

      {selectedCard && (
        <DonationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={() => fetchDonationProgress(selectedCard)}
          card={selectedCard}
        />
      )}

      {/* Global Success Alert */}
      <SuccessPaymentModal 
        isOpen={showSuccessAlert} 
        onClose={() => {
          setShowSuccessAlert(false);
          // Clean up URL parameters
          setSearchParams({}, { replace: true });
        }} 
      />
    </section>
  );
};

export default Receivers;