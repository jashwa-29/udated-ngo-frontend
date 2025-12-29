import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import React, { useEffect, useState, useCallback } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { fetchAllDonationcard } from '../../API/Home API/AllDonations';
import axios from 'axios';
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon, ClockIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import DonationModal from './DonationModal';

export default function CardSlider() {
  const { convert } = useCurrency();
  const navigate = useNavigate();
  const [donationCards, setDonationCards] = useState([]);
  const [donationProgress, setDonationProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    setUser(loggedInUser);
  }, []);

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
      
      setDonationProgress(prev => ({
        ...prev,
        [id]: { raised, percentage }
      }));
    } catch (error) {
      console.error('Error fetching donation amount:', error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchAllDonationcard();
        const validData = Array.isArray(data) 
          ? data.filter(card => card.status === 'approved') 
          : [];
        setDonationCards(validData);

        validData.forEach(card => fetchDonationProgress(card));
      } catch (error) {
        console.error('Error fetching donation cards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchDonationProgress]);

  const handleImageLoad = (id) => {
    setImageLoading(prev => ({ ...prev, [id]: false }));
  };

  const handleImageError = (id) => {
    setImageLoading(prev => ({ ...prev, [id]: false }));
  };

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

  if (loading) {
    return (
      <div id='card' className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div className="animate-pulse">
            <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 w-64 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 h-[420px] animate-pulse">
              <div className="h-52 w-full bg-gray-100 rounded-t-xl"></div>
              <div className="p-6 space-y-4">
                <div className="h-4 w-1/4 bg-gray-100 rounded"></div>
                <div className="h-6 w-3/4 bg-gray-100 rounded"></div>
                <div className="h-4 w-full bg-gray-100 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section id="card" className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
              Urgent Medical Cases
            </h2>
            <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl font-heading">
              Making a Difference, <span className="text-primary">One Life at a Time</span>
            </h1>
            <p className="mt-4 text-lg text-gray-500 leading-relaxed max-w-xl">
              Witness the power of collective compassion. These are verified individuals who need our support to overcome critical health challenges.
            </p>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <button className="swiper-button-prev-custom w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md group">
              <ChevronLeftIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <button className="swiper-button-next-custom w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md group">
              <ChevronRightIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={32}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 24 },
            1200: { slidesPerView: 3, spaceBetween: 32 },
          }}
          className="!pb-4"
        >
          {donationCards.map((card, index) => {
            const id = card.id || card._id;
            const progress = donationProgress[id] || { raised: 0, percentage: 0 };
            const imageUrl = card.patientimg 
              ? `${import.meta.env.VITE_API_BASE_URL}/uploads/donation-requests/${card.otherproof}`
              : null;
            const isImageLoading = imageLoading[id] !== false;
            const truncatedMedicalProblem = truncateMedicalProblem(card.medicalproblem);
            
            return (
              <SwiperSlide key={id || index} className="h-auto pb-4">
                <div className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 h-full flex flex-col hover:-translate-y-1 overflow-hidden">
                  {/* Image Container */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    {imageUrl ? (
                      <>
                        {isImageLoading && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                          </div>
                        )}
                        
                        <div className={`relative w-full h-full ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}>
                          <img
                            src={imageUrl}
                            alt={card.patientname}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            onLoad={() => handleImageLoad(id)}
                            onError={() => handleImageError(id)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <HeartIcon className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                    
                    {/* Urgent Badge */}
                    <div className="absolute top-3 right-3">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/90 backdrop-blur-sm rounded-lg shadow-sm">
                        <ClockIcon className="w-3.5 h-3.5 text-white" />
                        <span className="text-xs font-semibold text-white tracking-wide">URGENT</span>
                      </div>
                    </div>

                    {/* Case Number */}
                    <div className="absolute bottom-3 left-3">
                      <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
                        <span className="text-sm font-bold text-primary">
                          Case #{index + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Container */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Patient Name - Single line with proper truncation */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2">
                        <UserCircleIcon className="w-5 h-5 text-primary flex-shrink-0" />
                        <h3 className="text-lg font-bold text-gray-900 leading-tight truncate group-hover:text-primary transition-colors">
                          {card.patientname}
                        </h3>
                      </div>
                    </div>

                    {/* Medical Problem - Multi-line handling */}
                    <div className="mb-4">
                      <div className="group/medical relative">
                        <div className="px-3 py-2 bg-primary/5 rounded-lg border border-primary/10 hover:bg-primary/10 transition-colors">
                          <div className="flex items-start gap-2">
                            <div className="flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            </div>
                            <div className="min-w-0">
                              <span className="text-sm font-semibold text-primary leading-snug line-clamp-2">
                                {truncatedMedicalProblem}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Tooltip for full medical problem on hover */}
                        {card.medicalproblem.length > 40 && (
                          <div className="absolute z-10 invisible group-hover/medical:visible opacity-0 group-hover/medical:opacity-100 transition-all duration-200 bottom-full mb-2 left-0 right-0 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg transform translate-y-2 group-hover/medical:translate-y-0">
                            <div className="font-semibold mb-1 text-primary-light">Medical Condition:</div>
                            <div className="font-medium">{card.medicalproblem}</div>
                            <div className="absolute bottom-0 left-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-5 flex-1">
                      <div className="relative pl-4">
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 rounded-full"></div>
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 italic">
                          "{card.overview}"
                        </p>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="pt-5 border-t border-gray-100">
                      {/* Progress Summary */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-gray-700">Progress</span>
                          <span className="text-base font-bold text-primary">
                            {progress.percentage.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out relative"
                            style={{ width: `${progress.percentage}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                          </div>
                        </div>
                      </div>

                      {/* Amount Statistics */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-center">
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Raised</div>
                          <div className="text-base font-bold text-gray-900 truncate">
                            {convert(progress.raised)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Target</div>
                          <div className="text-base font-bold text-gray-900 truncate">
                            {convert(card.donationamount)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Needed</div>
                          <div className="text-base font-bold text-primary truncate">
                            {convert(Math.max(0, card.donationamount - progress.raised))}
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button 
                        onClick={() => handleDonateClick(card)}
                        className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all duration-300 text-center text-sm hover:shadow-md active:scale-[0.98] block group/btn"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <span>Donate</span>
                          <ChevronRightIcon className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                      </button>
                    </div>
                  </div>

             
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* View All Link */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <Link 
            to="/receivers" 
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark group"
          >
            View All Urgent Cases
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {selectedCard && (
        <DonationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={() => fetchDonationProgress(selectedCard)}
          card={selectedCard}
        />
      )}
    </section>
  );
}