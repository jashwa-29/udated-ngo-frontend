// src/context/CurrencyContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('INR');
  const [exchangeRate, setExchangeRate] = useState(null);

  const fetchExchangeRate = async () => {
    try {
      const response = await axios.get('https://api.frankfurter.app/latest', {
        params: {
          from: 'INR',
          to: 'USD',
        },
      });

      console.log('Frankfurter response:', response.data);

      const rate = response.data?.rates?.USD;
      if (typeof rate === 'number') {
        setExchangeRate(rate);
        console.log('INR to USD:', rate);
      } else {
        throw new Error('Invalid rate');
      }
    } catch (error) {
      console.error('Exchange rate fetch error:', error);
      setExchangeRate(0.012); // fallback
    }
  };

  useEffect(() => {
    fetchExchangeRate();
    const interval = setInterval(fetchExchangeRate, 86400000); // refresh daily
    return () => clearInterval(interval);
  }, []);

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'INR' ? 'USD' : 'INR'));
  };

  const setCurrencyDirect = (newCurrency) => {
    if (['INR', 'USD'].includes(newCurrency)) {
      setCurrency(newCurrency);
    }
  };

  const convert = (amountInINR) => {
    if (currency === 'INR') return `₹${amountInINR}`;
    if (!exchangeRate) return `$--`;
    return `$${(amountInINR * exchangeRate).toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, toggleCurrency, convert, setCurrency: setCurrencyDirect, exchangeRate }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
