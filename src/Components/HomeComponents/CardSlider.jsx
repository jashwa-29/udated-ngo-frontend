import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import React, { useEffect, useState, useCallback } from 'react';
import DonationModal from './DonationModal';
import { useCurrency } from '../../context/CurrencyContext';
import DonorLoginModal from './DonorLoginModal';
import { fetchAllDonationcard } from '../../API/Home API/AllDonations';
import axios from 'axios';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function CardSlider() {
  const { convert } = useCurrency();
  const donor = JSON.parse(localStorage.getItem('user'));
  const isDonorLoggedIn = Boolean(donor?.token && donor?.role === 'DONOR');
  const [donationCards, setDonationCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [selectedCard, setSelectedCard] = useState(null);
  const [donationProgress, setDonationProgress] = useState({});
  const [loading, setLoading] = useState(true);

  const handleDonateClick = (card) => {
    setSelectedCard(card);
    if (isDonorLoggedIn) {
      setShowModal(true);
    } else {
      setShowAuthModal(true);
      setAuthMode('login');
    }
  };

  const handleDonationSubmit = (amount) => {
    setShowModal(false);
    if (selectedCard) {
      fetchDonationProgress(selectedCard);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (selectedCard) {
      setShowModal(true);
    }
  };

  const fetchDonationProgress = useCallback(async (card) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/Home/GetdonationStatus/${card.id}`
      );

      const goal = card.donationamount;
      const raised = response.data.reduce((total, donation) => {
        return total + (donation.amount || 0);
      }, 0);

      const percentage = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
      
      setDonationProgress(prev => ({
        ...prev,
        [card.id]: { raised, percentage }
      }));
    } catch (error) {
      console.error('Error fetching donation amount:', error);
      setDonationProgress(prev => ({
        ...prev,
        [card.id]: { raised: 0, percentage: 0 }
      }));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchAllDonationcard();
        setDonationCards(data);

        // Fetch progress for all cards
        const progressPromises = data.map(card => fetchDonationProgress(card));
        await Promise.all(progressPromises);
      } catch (error) {
        console.error('Error fetching donation cards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchDonationProgress]);

  if (loading) {
    return (
      <div className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
             <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-2">Help Us Heal</h2>
             <h3 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">Featured Causes</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 h-[450px] animate-pulse">
              <div className="h-56 w-full bg-gray-200 rounded-t-2xl"></div>
              <div className="p-6 space-y-4">
                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                <div className="h-2 w-full bg-gray-200 rounded mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section id="causes" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-2">Help Us Heal</h2>
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">Featured Causes</h3>
            <p className="mt-4 text-gray-500 max-w-2xl">
              Your contribution can change lives. Browse through our urgent causes and make a direct impact today.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button className="swiper-button-prev-custom w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button className="swiper-button-next-custom w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-10 !overflow-visible"
        >
          {donationCards.map((card, index) => {
            const progress = donationProgress[card.id] || { raised: 0, percentage: 0 };
            const imageUrl = card.patientimg 
              ? `${import.meta.env.VITE_API_BASE_URL}/Home/image/${card.patientimg}`
              : null;
            
            return (
              <SwiperSlide key={card.id || index}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
                  <div className="relative h-56 overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="patient"
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary shadow-sm">
                      Medical
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {card.medicalproblem}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-1">
                      {card.overview}
                    </p>

                    <div className="space-y-4 mt-auto">
                      <div>
                        <div className="flex justify-between text-sm font-medium mb-2">
                          <span className="text-gray-900">Raised: <span className="text-primary">{convert(progress.raised)}</span></span>
                          <span className="text-gray-500">{progress.percentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progress.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-right mt-1 text-xs text-gray-400">
                          Goal: {convert(card.donationamount)}
                        </div>
                      </div>

                      <button
                        className="w-full py-3 px-4 bg-white border border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md active:transform active:scale-95"
                        onClick={() => handleDonateClick(card)}
                      >
                        Donate Now
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {selectedCard && (
          <DonationModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={handleDonationSubmit}
            card={selectedCard}
          />
        )}

        {showAuthModal && (
          <DonorLoginModal
            authMode={authMode}
            setAuthMode={setAuthMode}
            setShowAuthModal={setShowAuthModal}
            handleAuthSuccess={handleAuthSuccess}
          />
        )}
      </div>
    </section>
  );
}