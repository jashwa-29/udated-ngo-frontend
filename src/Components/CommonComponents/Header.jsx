import React, { useState, useEffect } from 'react';
import logo from '../../assets/ngo-logo.png';
import { Link } from 'react-router-dom';
import { useCurrency } from '../../context/CurrencyContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.token) {
      setIsLoggedIn(true);
      setUserType(userData.role); // 'ADMIN', 'RECEIVER', or 'DONOR'
    } else {
      setIsLoggedIn(false);
      setUserType(null);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCurrencyChange = (e) => {
    const val = e.target.value;
    if (val === 'INR' || val === 'USD') {
      setCurrency(val);
    }
  };

  const getDashboardLink = () => {
    switch(userType) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'RECEIVER':
        return '/recipient/dashboard';
      case 'DONOR':
        return '/donor/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white py-3 border-b border-black/25'
      } ${mobileMenuOpen ? 'bg-white' : ''}`}
    >
      <div className="relative">
        <div className="relative px-4 mx-auto sm:px-6 lg:px-16">
          <nav className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex-shrink-0">
              <Link to="/" className="flex">
                <img src={logo} alt="NGO Logo" className="md:w-[130px] w-auto lg:h-auto h-10" />
              </Link>
            </div>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="inline-flex p-2 text-black transition-all duration-200 rounded-md lg:hidden focus:bg-gray-100 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>

            {/* Desktop Menu */}
            <div className="hidden lg:flex lg:items-center lg:space-x-10">
              <Link to="/" className="text-base font-medium text-[#525560]">Home</Link>
              <Link to="/about" className="text-base font-medium text-[#525560]">About us</Link>
              <Link to="/receivers" className="text-base font-medium text-[#525560]">Receivers</Link>
              <Link to="/contact" className="text-base font-medium text-[#525560]">Contact us</Link>
      

              {/* Currency Dropdown */}
              <select
                value={currency}
                onChange={handleCurrencyChange}
                className="text-base font-medium text-[#0B8B68] border border-[#0B8B68] px-3 py-1 rounded hover:bg-[#0B8B68] hover:text-white transition bg-white"
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
              </select>
            </div>

            {isLoggedIn ? (
              <Link
                to={getDashboardLink()}
                className="items-center justify-center hidden px-8 py-2.5 text-base font-semibold hover:text-[#0B8B68] transition duration-300 bg-[#0B8B68] hover:bg-white border border-white hover:border-[#0B8B68] text-white rounded-[6px] lg:inline-flex"
                role="button"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="items-center justify-center hidden px-8 py-2.5 text-base font-semibold hover:text-[#0B8B68] transition duration-300 bg-[#0B8B68] hover:bg-white border border-white hover:border-[#0B8B68] text-white rounded-[6px] lg:inline-flex"
                role="button"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-4/5 max-w-xs transform bg-black px-6 py-10 transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden`}
      >
        <div className="flex justify-end">
          <button
            onClick={() => setMobileMenuOpen(false)}
            type="button"
            className="inline-flex p-2 text-white transition-all duration-200 rounded-md focus:bg-gray-800 hover:bg-gray-800"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col flex-grow mt-10 space-y-4">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-white text-base font-medium">Home</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-white text-base font-medium">About us</Link>
          <Link to="/receivers" onClick={() => setMobileMenuOpen(false)} className="text-white text-base font-medium">Receivers</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-white text-base font-medium">Contact us</Link>
        </div>

        <div className="mt-auto pt-6 space-y-4">
          {isLoggedIn ? (
            <Link
              to={getDashboardLink()}
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-semibold text-black transition-all duration-200 bg-[#0B8B68] border border-transparent rounded"
              role="button"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-semibold text-black transition-all duration-200 bg-[#0B8B68] border border-transparent rounded"
              role="button"
            >
              Login
            </Link>
          )}

          {/* Currency Dropdown in Mobile */}
          <select
            value={currency}
            onChange={(e) => {
              setCurrency(e.target.value);
              setMobileMenuOpen(false);
            }}
            className="w-full bg-white text-black text-base font-medium px-4 py-2 rounded border border-white"
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;