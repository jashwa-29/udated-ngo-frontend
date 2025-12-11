import React, { useState, useEffect } from 'react';
import logo from '../../assets/ngo-logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';  // Import your currency context

const DashboardHeader = ({ onToggleSidebar, isSidebarOpen, heading }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileLogoutOpen, setMobileLogoutOpen] = useState(false);
  const navigate = useNavigate();

  const { currency, setCurrency } = useCurrency(); // Use currency context

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 py-3 ${
        isScrolled ? 'bg-white shadow-md border-0' : 'bg-white border-b border-black/25'
      }`}
    >
      <div className="px-4 mx-auto sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Sidebar Toggle (Mobile) */}
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded hover:bg-gray-100"
              aria-label="Toggle Sidebar"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src={logo} alt="NGO Logo" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Center Heading */}
          <h1 className="text-xl font-bold uppercase">{heading}</h1>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Currency Dropdown (Desktop) */}
            <select
              value={currency}
              onChange={handleCurrencyChange}
              className="hidden lg:block text-sm font-medium border border-[#4D9186] px-3 py-1 rounded hover:bg-[#4D9186] hover:text-white transition bg-white text-[#4D9186]"
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
            </select>

            {/* Desktop Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden lg:inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-[#4D9186] border border-white hover:bg-white hover:text-[#4D9186] hover:border-[#4D9186] rounded transition"
            >
              Logout
            </button>

            {/* Mobile Dropdown for Logout + Currency */}
            <div className="lg:hidden relative">
              <button
                onClick={() => setMobileLogoutOpen(!mobileLogoutOpen)}
                className="text-sm font-medium px-3 py-1 border rounded text-white bg-[#4D9186]"
              >
                ☰
              </button>
              {mobileLogoutOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md p-4 z-50 min-w-[160px]">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 mb-2 text-sm text-red-600 hover:bg-gray-100 rounded"
                  >
                    Logout
                  </button>
                  <select
                    value={currency}
                    onChange={(e) => {
                      setCurrency(e.target.value);
                      setMobileLogoutOpen(false);
                    }}
                    className="w-full text-sm font-medium border border-gray-300 rounded px-3 py-1"
                  >
                    <option value="INR">₹ INR</option>
                    <option value="USD">$ USD</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default DashboardHeader;
