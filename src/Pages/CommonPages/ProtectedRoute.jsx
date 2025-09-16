import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import DashboardHeader from '../../Components/CommonComponents/DashboardHeader';
import Footer from '../../Components/CommonComponents/Footer';

// All allowed paths configuration
const ALLOWED_PATHS = {
  ADMIN: [
    // Main navigation items
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'All Recipients', path: '/admin/total-recipients' },
    { label: 'All Donors', path: '/admin/total-donors' },
    { label: 'Requests', path: '/admin/requests' },
    { label: 'Terms and Condition', path: '/privacy-policy' },
    { label: 'Privacy Policy', path: '/support' },
    
    // Dynamic routes (no labels)
    { path: '/admin/recipient/:id' },
    { path: '/admin/request/:id' },
    { path: '/admin/total-donors/donor/:id' }
  ],
  DONOR: [
    { label: 'Dashboard', path: '/donor/dashboard' },
    { label: 'My Donations', path: '/donor/mydonation' },
    { label: 'Terms and Condition', path: '/privacy-policy' },
    { label: 'Privacy Policy', path: '/privacy-policy' },

   

  ],
  RECEIVER: [
    { label: 'Dashboard', path: '/recipient/dashboard' },
    { label: 'Request Form', path: '/recipient/request' },
    { label: 'Terms and Condition', path: '/requests' },
    { label: 'Privacy Policy', path: '/support' },
       { path: '/recipient/recipient-details' },
  ]
};

// Default redirect paths for each role
const ROLE_REDIRECTS = {
  ADMIN: '/admin/dashboard',
  DONOR: '/donor/dashboard',
  RECEIVER: '/recipient/dashboard'
};

// Helper function to check if path is allowed
const isPathAllowed = (role, currentPath) => {
  if (!role || !ALLOWED_PATHS[role]) return false;
  
  return ALLOWED_PATHS[role].some(item => {
    const pathToCheck = item.path || item.label;
    
    // Exact match
    if (currentPath === pathToCheck) return true;
    
    // Dynamic path with parameters
    if (pathToCheck.includes(':')) {
      const basePath = pathToCheck.split(':')[0];
      return currentPath.startsWith(basePath);
    }
    
    // Nested path
    return currentPath.startsWith(`${pathToCheck}/`);
  });
};

const ProtectedLayout = (   {children}) => {
  // Get user data from localStorage
  let user = {};
  try {
    const userData = localStorage.getItem('user');
    user = userData ? JSON.parse(userData) : {};
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return <Navigate to="/login" replace />;
  }

  const role = user?.role;
  const location = useLocation();
  const currentPath = location.pathname;

  // Redirect to login if no valid role
  if (!role || !ALLOWED_PATHS[role]) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if current path is allowed
  if (!isPathAllowed(role, currentPath)) {
    return <Navigate to={ROLE_REDIRECTS[role]} replace />;
  }

  return (
    <>
     
      <div className="flex min-h-screen bg-gray-100">
        <main className="flex-1">
       {children}
        </main>
      </div>
   
    </>
  );
};

export default ProtectedLayout;