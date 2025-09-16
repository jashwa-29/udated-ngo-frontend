import React, { useEffect, useState, useCallback } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import axios from 'axios';
import { fetchAllDonationcard } from '../../API/Home API/AllDonations';
import DonationModal from '../../Components/HomeComponents/DonationModal';
import DonorLoginModal from '../../Components/HomeComponents/DonorLoginModal';

const Receivers = () => {
  const { convert } = useCurrency();
  const donor = JSON.parse(localStorage.getItem('user'));
  const isDonorLoggedIn = Boolean(donor?.token);

  const [donationCards, setDonationCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [selectedCard, setSelectedCard] = useState(null);
  const [donationProgress, setDonationProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDonateClick = useCallback((card) => {
    setSelectedCard(card);
    if (isDonorLoggedIn) {
      setShowModal(true);
    } else {
      setShowAuthModal(true);
      setAuthMode('login');
    }
  }, [isDonorLoggedIn]);

  const handleDonationSubmit = useCallback((amount) => {
    console.log('Donated amount:', amount);
    setShowModal(false);
    if (selectedCard) {
      fetchDonationProgress(selectedCard);
    }
  }, [selectedCard]);

  const handleAuthSuccess = useCallback(() => {
    setShowAuthModal(false);
    if (selectedCard) {
      setShowModal(true);
    }
  }, [selectedCard]);

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

      setDonationProgress((prev) => ({
        ...prev,
        [card.id]: { raised, percentage },
      }));
    } catch (error) {
      console.error('Error fetching donation amount:', error);
      setDonationProgress((prev) => ({
        ...prev,
        [card.id]: { raised: 0, percentage: 0 },
      }));
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchDonationCards = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await fetchAllDonationcard({ signal: controller.signal });
        
        if (!isMounted) return;
        
        setDonationCards(data);

        // Fetch progress for all cards
        await Promise.all(data.map(card => fetchDonationProgress(card)));
      } catch (error) {
        if (isMounted && error.name !== 'AbortError') {
          console.error('Error fetching donation cards:', error);
          setError('Failed to load donation recipients. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDonationCards();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [fetchDonationProgress]);

  if (isLoading) {
    return (
      <section className="px-4 mx-auto sm:px-6 lg:px-16 py-8">
        <h2 className="text-2xl font-bold pl-7 py-6">Medical Donation Recipients</h2>
        <div className="flex items-center justify-center flex-wrap gap-11">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-md shadow-md min-h-[300px] my-5 w-[300px] animate-pulse">
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
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 mx-auto sm:px-6 lg:px-16 py-8">
        <h2 className="text-2xl font-bold pl-7 py-6">Medical Donation Recipients</h2>
        <div className="text-center py-10 text-red-500">{error}</div>
      </section>
    );
  }

  return (
    <section className="px-4 mx-auto sm:px-6 lg:px-16 py-8">
      <h2 className="text-2xl font-bold pl-7 py-6">
        Medical Donation Recipients ({donationCards.length})
      </h2>
      
      {donationCards.length > 0 ? (
        <div className="flex items-center justify-center flex-wrap gap-11">
          {donationCards.map((card) => {
            const progress = donationProgress[card.id] || { raised: 0, percentage: 0 };
            const imageUrl = card.patientimg 
              ? `${import.meta.env.VITE_API_BASE_URL}/Home/image/${card.patientimg}`
              : null;
            
            return (
              <div key={card.id} className="bg-white rounded-md shadow-md min-h-[300px] my-5 w-[300px] hover:shadow-lg transition-shadow duration-300">
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
                  <h3 className="text-sm font-semibold leading-tight mb-3 line-clamp-1">
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
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10">No donation recipients available at this time.</div>
      )}

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
    </section>
  );
};

export default Receivers;









// import React from 'react'
//   import { useCurrency } from '../../context/CurrencyContext';
// const donationCards = Array(6).fill({
//   title: "Donate For Poor Peoples Treatment And Medicine.",
//   raised: 500,
//   goal: 5000,
//   progress: 60,
// });
// const Receivers = () => {

//    const { convert } = useCurrency();
//   return (
//     <section className='px-4 mx-auto sm:px-6 lg:px-16 py-8'>
//         <h2 className='text-2xl font-bold pl-7 py-6
//         '>Medical Donation Recipients (10)</h2>
//         <div className='flex items-center justify-center flex-wrap gap-11  '>
//                {donationCards.map((card, index) => (
       
//             <div className="bg-white rounded-md shadow-md min-h-[300px] w-[300px] my-5">
//               <div className="h-44 bg-gray-200 rounded-t-md" />

//               <div className="p-4 space-y-2">
//                 <p className="text-xs text-gray-500 font-semibold mb-3">Medical</p>
//                 <h3 className="text-sm font-semibold leading-tight mb-3">
//                   {card.title}
//                 </h3>
//                 <p className="text-xs text-gray-500 mb-3">
//                   Lorem Ipsum Dolor Sit Amet, Consete Sadipscing Elitr, Sed Diam Nonumy Nonumy ...
//                 </p>

//                 <div className='mb-5'>
//                   <div className="text-xs text-gray-500 flex justify-between mb-1">
//                     <span>Donation</span>
//                     <span>{card.progress}%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
//                     <div
//                       className="bg-[#0B8B68] h-1.5 rounded-full"
//                       style={{ width: `${card.progress}%` }}
//                     ></div>
//                   </div>
//                   <div className="text-xs text-gray-500 flex justify-between">
//                       <span>Raised: {convert(card.raised)}</span>
//                     <span>Goal: {convert(card.goal)}</span>
//                   </div>
//                 </div>
// <div className='flex justify-center'>
//                 <button className="mt-3   px-8 py-2.5 text-sm font-medium hover:text-[#0B8B68] transition duration-300 bg-[#0B8B68] hover:bg-white border border-white hover:border-[#0B8B68] text-white rounded-[6px]" onClick={()=>handleDonateClick()}>
//                   Donate Now
//                 </button></div>
//               </div>
//             </div>
        
//         ))}
//         </div>
//     </section>
//   )
// }

// export default Receivers
