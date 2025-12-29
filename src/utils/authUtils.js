// Authentication utility functions for managing user sessions

/**
 * Store user data in localStorage
 * @param {Object} userData - User data from backend login response
 */
export const setUserSession = (userData) => {
  const sessionData = {
    userid: userData.userid,
    username: userData.username,
    email: userData.email,
    role: userData.role,
    token: userData.token,
  };
  
  localStorage.setItem('user', JSON.stringify(sessionData));
};

/**
 * Get user data from localStorage
 * @returns {Object|null} User data or null if not logged in
 */
export const getUserSession = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    const userData = JSON.parse(userStr);
    
    // Support both old and new format
    return {
      userid: userData.userid || userData.userId,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      token: userData.token,
    };
  } catch (error) {
    console.error('Error parsing user session:', error);
    return null;
  }
};

/**
 * Get user ID from localStorage
 * @returns {string|null} User ID or null
 */
export const getUserId = () => {
  const user = getUserSession();
  return user?.userid || null;
};

/**
 * Get user token from localStorage
 * @returns {string|null} JWT token or null
 */
export const getUserToken = () => {
  const user = getUserSession();
  return user?.token || null;
};

/**
 * Get user role from localStorage
 * @returns {string|null} User role (ADMIN/DONOR/RECEIVER) or null
 */
export const getUserRole = () => {
  const user = getUserSession();
  return user?.role || null;
};

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
export const isLoggedIn = () => {
  const user = getUserSession();
  return !!(user && user.token);
};

/**
 * Check if user has specific role
 * @param {string} role - Role to check (ADMIN/DONOR/RECEIVER)
 * @returns {boolean} True if user has the specified role
 */
export const hasRole = (role) => {
  const userRole = getUserRole();
  return userRole === role;
};

/**
 * Check if user is admin
 * @returns {boolean} True if user is admin
 */
export const isAdmin = () => hasRole('ADMIN');

/**
 * Check if user is donor
 * @returns {boolean} True if user is donor
 */
export const isDonor = () => hasRole('DONOR');

/**
 * Check if user is receiver
 * @returns {boolean} True if user is receiver
 */
export const isReceiver = () => hasRole('RECEIVER');

/**
 * Clear user session (logout)
 */
export const clearUserSession = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('receiverId'); // Clean up old data
  localStorage.removeItem('pendingRecipientRequest');
};

/**
 * Update user session data
 * @param {Object} updates - Partial user data to update
 */
export const updateUserSession = (updates) => {
  const currentUser = getUserSession();
  if (!currentUser) return;
  
  const updatedUser = { ...currentUser, ...updates };
  localStorage.setItem('user', JSON.stringify(updatedUser));
};

/**
 * Get authorization header for API requests
 * @returns {Object} Authorization header object
 */
export const getAuthHeader = () => {
  const token = getUserToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
