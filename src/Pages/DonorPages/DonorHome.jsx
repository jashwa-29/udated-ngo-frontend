import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import { HeartIcon, ChevronLeftIcon, ChevronRightIcon, ShieldCheckIcon, UsersIcon, SparklesIcon, ClockIcon, TargetIcon, UserCircleIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DonationModal from '../../Components/HomeComponents/DonationModal';
import { fetchAllDonationcard } from '../../API/Home API/AllDonations';
import { useCurrency } from '../../context/CurrencyContext';
import Skeleton from '../../Components/CommonComponents/Skeleton';
import ErrorState from '../../Components/CommonComponents/ErrorState';

const MissionCardSkeleton = () => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-[540px]">
    <Skeleton className="h-56 w-full rounded-none" />
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-6 w-1/2" />
      </div>
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-20 w-full rounded-xl" />
      <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-12 w-32 rounded-xl" />
      </div>
    </div>
  </div>
);

const DonorHome = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [donationCards, setDonationCards] = useState([]);
  const [donationProgress, setDonationProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { convert } = useCurrency();

  const fetchDonationProgress = useCallback(async (card) => {
    try {
      const id = card.id || card._id;
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/Home/GetdonationStatus/${id}`
      );

      const goal = card.donationamount;
      const raised = Array.isArray(response.data) 
        ? response.data.reduce((total, d) => total + (d.amount || 0), 0)
        : 0;

      const percentage = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
      
      setDonationProgress(prev => ({
        ...prev,
        [id]: { raised, percentage }
      }));
    } catch (error) {
      console.error('Error fetching donation amount:', error);
      const id = card.id || card._id;
      setDonationProgress(prev => ({ ...prev, [id]: { raised: 0, percentage: 0 } }));
    }
  }, []);

  const fetchData = useCallback(async (showToast = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllDonationcard();
      const validData = Array.isArray(data) 
        ? data.filter(card => card.status === 'approved') 
        : [];
      setDonationCards(validData);
      await Promise.all(validData.map(card => fetchDonationProgress(card)));
      if (showToast) toast.success('Active missions updated');
    } catch (error) {
      setError('Failed to load active missions.');
      toast.error('Unable to fetch missions');
    } finally {
      setIsLoading(false);
    }
  }, [fetchDonationProgress]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDonateClick = (card) => {
    setSelectedCard(card);
    setShowModal(true);
  };

  const handleDonationSuccess = () => {
    // Refresh progress for the specific card
    if (selectedCard) {
      fetchDonationProgress(selectedCard);
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen relative overflow-hidden pt-10 md:pt-15 pb-12 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6 md:gap-8">
          <div className="max-w-2xl">
            <h2 className="text-sm md:text-base text-primary font-semibold tracking-wide uppercase">
              Donor Dashboard
            </h2>
            <h1 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl md:text-4xl font-heading">
              Be the Change You <span className="text-primary">Wish to See</span>
            </h1>
            <p className="mt-3 md:mt-4 text-sm md:text-lg text-gray-500 leading-relaxed max-w-xl">
              Empower verified individuals fighting critical medical battles. Your generosity is their strongest ally.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2 md:gap-3">
            <button className="swiper-button-prev-donor w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md group">
              <ChevronLeftIcon className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
            </button>
            <button className="swiper-button-next-donor w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md group">
              <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Campaign Carousel */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <MissionCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="py-10">
            <ErrorState message={error} onRetry={() => fetchData(true)} title="Missions Unavailable" />
          </div>
        ) : donationCards.length > 0 ? (
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            spaceBetween={32}
            slidesPerView={1}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={{
              nextEl: '.swiper-button-next-donor',
              prevEl: '.swiper-button-prev-donor',
            }}
            breakpoints={{
              640: { slidesPerView: 1.2, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 24 },
              1200: { slidesPerView: 3, spaceBetween: 32 },
            }}
            className="!pb-12"
          >
            {donationCards.map((card, index) => {
              const id = card.id || card._id;
              const progress = donationProgress[id] || { raised: 0, percentage: 0 };
              const imageUrl = card.patientimg 
                ? `${import.meta.env.VITE_API_BASE_URL}/uploads/donation-requests/${card.otherproof}`
                : null;
              
              // Helper to truncate text for inline display
              const truncatedMedicalProblem = card.medicalproblem?.length > 35 
                ? card.medicalproblem.substring(0, 35) + '...' 
                : card.medicalproblem;
              
              return (
                <SwiperSlide key={id} className="h-auto pb-4">
                  <div className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 h-full flex flex-col hover:-translate-y-1 overflow-hidden">
                    
                    {/* Image Section */}
                    <div className="relative h-56 overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={card.patientname}
                          className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=Medical+Case';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                          <HeartIcon className="w-16 h-16 text-gray-200" />
                        </div>
                      )}
                      
                      {/* Urgent Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/90 rounded-lg backdrop-blur-sm shadow-sm">
                          <ClockIcon className="w-3.5 h-3.5 text-white" />
                          <span className="text-xs font-semibold text-white">URGENT</span>
                        </div>
                      </div>

                      {/* Case Number */}
                      <div className="absolute bottom-4 left-4">
                        <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
                          <span className="text-sm font-bold text-[#4D9186]">Case #{index + 1}</span>
                        </div>
                      </div>

                      {/* Progress overlay on image */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                        <div className="flex justify-between items-center">
                          <div className="text-left">
                            <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Progress</div>
                            <div className="text-lg font-black">{progress.percentage.toFixed(0)}%</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Raised</div>
                            <div className="text-sm font-black">{convert(progress.raised)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <UserCircleIcon className="w-5 h-5 text-[#4D9186] flex-shrink-0" />
                          <h3 className="text-lg font-black text-gray-900 leading-tight truncate group-hover:text-[#4D9186] transition-colors">
                            {card.patientname}
                          </h3>
                        </div>

                        <div className="mb-4">
                          <div className="group/medical relative">
                            <div className="px-3 py-2 bg-[#4D9186]/5 rounded-lg border border-[#4D9186]/10">
                              <div className="flex items-start gap-2">
                                <div className="flex-shrink-0 mt-1">
                                  <div className="w-1.5 h-1.5 bg-[#4D9186] rounded-full"></div>
                                </div>
                                <div className="min-w-0">
                                  <span className="text-xs font-bold text-gray-700 leading-snug line-clamp-2">
                                    {truncatedMedicalProblem}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Tooltip for full medical problem */}
                            {card.medicalproblem?.length > 35 && (
                              <div className="absolute z-50 invisible group-hover/medical:visible opacity-0 group-hover/medical:opacity-100 transition-all duration-200 bottom-full mb-2 left-0 right-0 bg-gray-900 text-white text-[10px] rounded-xl p-3 shadow-xl">
                                <div className="font-black mb-1 text-[#4D9186] uppercase tracking-widest">Medical Condition:</div>
                                <div className="font-bold">{card.medicalproblem}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-5 flex-1">
                        <div className="relative pl-4">
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-100 rounded-full"></div>
                          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 italic font-medium">
                            "{card.overview}"
                          </p>
                        </div>
                      </div>

                      <div className="pt-5 border-t border-gray-100">
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Goal Amount</span>
                            <span className="text-sm font-black text-[#4D9186]">
                              {convert(card.donationamount)}
                            </span>
                          </div>
                          
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                            <div
                              className="h-full bg-gradient-to-r from-[#4D9186] to-[#6fb9ac] rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${progress.percentage}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="mb-5 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Still Needed</div>
                              <div className="text-base font-black text-gray-900">
                                {convert(Math.max(0, card.donationamount - progress.raised))}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Impact</div>
                              <div className="text-[10px] font-black text-[#4D9186] uppercase bg-white px-2 py-1 rounded-md shadow-sm">Critical</div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDonateClick(card)}
                          className="w-full py-4 bg-gray-900 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-[#4D9186] transition-all duration-300 hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
                        >
                          <SparklesIcon className="w-3.5 h-3.5 transform group-hover/btn:rotate-12 transition-transform" />
                          <span>Support {card.patientname.split(' ')[0]}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 border-dashed">
            <HeartIcon className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-tight">No Active Campaigns</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto font-medium">
              All current campaigns have been fulfilled. Please check back soon for new opportunities to make a difference.
            </p>
          </div>
        )}

        {/* Trust Batch */}
        <div className="mt-20 pt-12 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: ShieldCheckIcon, 
                title: "100% Verified", 
                desc: "Every medical case is manually vetted with hospital documentation." 
              },
              { 
                icon: TargetIcon, 
                title: "Direct Impact", 
                desc: "Your donations reach hospitals directly for life-saving treatments." 
              },
              { 
                icon: UsersIcon, 
                title: "Community Support", 
                desc: "Join thousands of donors making a real difference in lives." 
              }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="p-3 bg-primary/10 rounded-lg mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedCard && (
        <DonationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleDonationSuccess}
          card={selectedCard}
        />
      )}
    </section>
  );
};

export default DonorHome;