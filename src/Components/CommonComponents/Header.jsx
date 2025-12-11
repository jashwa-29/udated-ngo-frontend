import React, { useState, useEffect } from 'react';
import logo from '../../assets/ngo-logo.png';
import { Link, useLocation } from 'react-router-dom';
import { useCurrency } from '../../context/CurrencyContext';
import { ROLES } from '../../utils/constants';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const { currency, setCurrency } = useCurrency();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.token) {
      setIsLoggedIn(true);
      setUserType(userData.role);
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
      case ROLES.ADMIN:
        return '/admin/dashboard';
      case ROLES.RECIPIENT:
        return '/recipient/dashboard';
      case ROLES.DONOR:
        return '/donor/dashboard';
      default:
        return '/login';
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary';
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-white py-4 border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-2">
                <img src={logo} alt="GiveAd Logo" className="h-15 w-auto" />
              </Link>
            </div>

            {/* Desktop Menu - Hidden on mobile and tablet (md) */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/')}`}>Home</Link>
              <Link to="/about" className={`text-sm font-medium transition-colors ${isActive('/about')}`}>About Us</Link>
              <Link to="/receivers" className={`text-sm font-medium transition-colors ${isActive('/receivers')}`}>Receivers</Link>
              <Link to="/contact" className={`text-sm font-medium transition-colors ${isActive('/contact')}`}>Contact</Link>
            </div>

            {/* Right Section (Currency + Auth) - Hidden on mobile and tablet */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="relative">
                <select
                  value={currency}
                  onChange={handleCurrencyChange}
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <option value="INR">🇮🇳 INR</option>
                  <option value="USD">🇺🇸 USD</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              {isLoggedIn ? (
                <Link
                  to={getDashboardLink()}
                  className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-primary rounded-lg hover:bg-primary-dark shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-primary rounded-lg hover:bg-primary-dark shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile/Tablet Menu Button - Visible on lg and below */}
            <div className="flex lg:hidden">
              <button
                type="button"
                className="text-gray-700 hover:text-primary p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay - Moved outside header to avoid backdrop-filter issues */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
          onClick={() => setMobileMenuOpen(false)} 
        />
        
        {/* Menu Panel */}
        <div className={`fixed inset-y-0 right-0 z-[60] w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <img src={logo} alt="GiveAd Logo" className="h-8 w-auto" />
                <span className="text-lg font-bold font-heading text-gray-900">Give<span className="text-primary">Ad</span></span>
              </Link>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col space-y-6">
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${location.pathname === '/' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/about" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${location.pathname === '/about' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    About Us
                  </Link>
                  <Link 
                    to="/receivers" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${location.pathname === '/receivers' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    Receivers
                  </Link>
                  <Link 
                    to="/contact" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${location.pathname === '/contact' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    Contact
                  </Link>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Currency</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setCurrency('INR')}
                      className={`flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        currency === 'INR' 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      🇮🇳 INR
                    </button>
                    <button
                      onClick={() => setCurrency('USD')}
                      className={`flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        currency === 'USD' 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      🇺🇸 USD
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              {isLoggedIn ? (
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 text-base font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark shadow-sm transition-all transform active:scale-95"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 text-base font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark shadow-sm transition-all transform active:scale-95"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;