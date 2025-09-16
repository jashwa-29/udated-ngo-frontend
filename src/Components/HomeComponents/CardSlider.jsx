import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import React, { useEffect, useState, useCallback } from 'react';
import DonationModal from './DonationModal';
import { useCurrency } from '../../context/CurrencyContext';
import DonorLoginModal from './DonorLoginModal';
import { fetchAllDonationcard } from '../../API/Home API/AllDonations';
import axios from 'axios';

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
    console.log('Donated amount:', amount);
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
      <div className="py-10 px-4 relative max-w-7xl mx-auto my-10">
        <h2 className="text-3xl font-semibold mb-6">Medical Donation Recipients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-md shadow-md h-[300px] animate-pulse">
              <div className="h-44 w-full bg-gray-200 rounded-t-md"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-3 w-full bg-gray-200 rounded"></div>
                <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                <div className="h-2 w-full bg-gray-200 rounded mt-4"></div>
                <div className="flex justify-between">
                  <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
                  <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div id="card" className="py-10 px-4 relative max-w-7xl mx-auto my-10">
      <h2 className="text-3xl font-semibold mb-6">Medical Donation Recipients</h2>

      <div className="absolute top-10 right-4 z-10 flex gap-2">
        <div className="swiper-button-prev !static !text-white !bg-[#0B8B68] hover:!bg-[#0B8B68] w-10 h-10 rounded-full flex p-5 items-center justify-center" />
        <div className="swiper-button-next !static !text-white !bg-[#0B8B68] hover:!bg-[#0B8B68] w-10 h-10 rounded-full flex p-5 items-center justify-center" />
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="pb-10"
      >
        {donationCards.map((card, index) => {
          const progress = donationProgress[card.id] || { raised: 0, percentage: 0 };
          const imageUrl = card.patientimg 
            ? `${import.meta.env.VITE_API_BASE_URL}/Home/image/${card.patientimg}`
            : null;
          
          return (
            <SwiperSlide key={card.id || index}>
              <div className="bg-white rounded-md shadow-md min-h-[300px] my-5">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="patient"
                    className="h-44 w-full object-cover rounded-t-md"
                    loading="lazy"
                  />
                )}
                <div className="p-4 space-y-2">
                  <p className="text-xs text-gray-500 font-semibold mb-3">Medical</p>
                  <h3 className="text-sm font-semibold leading-tight mb-3">
                    {card.medicalproblem}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{card.overview}</p>

                  <div className="mb-5">
                    <div className="text-xs text-gray-500 flex justify-between mb-1">
                      <span>Donation</span>
                      <span>{progress.percentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                      <div
                        className="bg-[#0B8B68] h-1.5 rounded-full"
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>Raised: {convert(progress.raised)}</span>
                      <span>Goal: {convert(card.donationamount)}</span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="mt-3 px-8 py-2.5 text-sm font-medium hover:text-[#0B8B68] transition duration-300 bg-[#0B8B68] hover:bg-white border border-white hover:border-[#0B8B68] text-white rounded-[6px]"
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
  );
}