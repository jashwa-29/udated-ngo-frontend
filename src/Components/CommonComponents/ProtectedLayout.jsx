import React, { useState } from 'react';
import DashboardHeader from '../CommonComponents/DashboardHeader';

import { useLocation, Link } from 'react-router-dom';

const ProtectedLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;

  const location = useLocation();

  const navLinks = {
    ADMIN: [
      { label: 'Dashboard', path: '/admin/dashboard' },
           { label: 'All Recipients', path: '/admin/total-recipients' },
        { label: 'All Donors', path: '/admin/total-donors' },
      { label: 'Requests', path: '/admin/requests' },
    { label: 'Terms and Conditon', path: '/privacy-policy' },
      { label: 'Privacy Policy', path: '/support' },
    ],
    DONOR: [
      { label: 'Dashboard', path: '/donor/dashboard' },
      { label: 'My Donations', path: '/donor/mydonation' },
    { label: 'Terms and Conditon', path: '/privacy-policy' },
      { label: 'Privacy Policy', path: '/privacy-policy' },
    ],
    RECEIVER: [
      { label: 'Dashboard', path: '/recipient/dashboard' },
         { label: 'Request Form', path: '/recipient/request' },
      { label: 'Terms and Conditon', path: '/requests' },
      { label: 'Privacy Policy', path: '/support' },
    ],
  };

  const links = navLinks[role] || [];
function formatRole(str) {
  const lower = str.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}


  return (
    <>
      <DashboardHeader
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isSidebarOpen={sidebarOpen}
        heading={role}
      />

      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`bg-white shadow-lg p-4 fixed md:static z-40 transition-transform duration-300 md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } w-64 h-full md:h-auto md:w-64`}
        >
         <div className='sticky top-28'>
      <h2 className="text-xl font-semibold mb-4">
  {formatRole(role)} Panel
</h2>
          <nav className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-2 rounded  text-black ${
                  location.pathname.startsWith(link.path) ? 'bg-[#4D9186] text-white font-medium hover:bg-[#4D9186]' : 'hover:bg-gray-200'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
         </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white">{children}   </main>
      </div>

   
    </>
  );
};

export default ProtectedLayout;
