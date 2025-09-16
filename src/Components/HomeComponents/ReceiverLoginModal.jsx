import React, { useState, useEffect } from 'react';
import { UserLogin } from '../../API/LoginAPI/UserLogin';
import { userRegister } from '../../API/LoginAPI/UserRegister';

const ReceiverLoginModal = ({ authMode, toggleAuthMode, setShowAuthModal }) => {
  const [authForm, setAuthForm] = useState({
    email: '',
    number: '',
    address: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    number: '',
    address: '',
    password: '',
    name: '',
    confirmPassword: '',
    form: ''
  });

  const [touched, setTouched] = useState({
    email: false,
    number: false,
    address: false,
    password: false,
    name: false,
    confirmPassword: false
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone) return 'Phone number is required';
    if (!phoneRegex.test(phone)) return 'Please enter a valid 10-digit phone number';
    return '';
  };

  const validateName = (name) => {
    if (!name) return 'Full name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const validateAddress = (address) => {
    if (!address) return 'Address is required';
    if (address.length < 5) return 'Address must be at least 5 characters';
    return '';
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) return 'Password is required';
    if (!passwordRegex.test(password)) return 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    return '';
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return '';
  };

  // Validate field on change
  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return validateEmail(value);
      case 'number':
        return validatePhone(value);
      case 'name':
        return validateName(value);
      case 'address':
        return validateAddress(value);
      case 'password':
        return validatePassword(value);
      case 'confirmPassword':
        return validateConfirmPassword(value, authForm.password);
      default:
        return '';
    }
  };

  // Handle input changes with validation
  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    
    setAuthForm((prev) => ({
      ...prev,
      [name]: value
    }));

    // Validate field if it's been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error
      }));
    }
  };

  // Handle blur events (mark field as touched)
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true
    }));

    // Validate the field
    const error = validateField(name, authForm[name]);
    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };

  // Check if form is valid
  const isFormValid = () => {
    if (authMode === 'login') {
      return authForm.email && authForm.password && 
             !errors.email && !errors.password;
    } else {
      return authForm.email && authForm.number && authForm.address && 
             authForm.password && authForm.name && authForm.confirmPassword &&
             !errors.email && !errors.number && !errors.address && 
             !errors.password && !errors.name && !errors.confirmPassword;
    }
  };

  // Reset form when auth mode changes
  useEffect(() => {
    setErrors({
      email: '',
      number: '',
      address: '',
      password: '',
      name: '',
      confirmPassword: '',
      form: ''
    });
    setTouched({
      email: false,
      number: false,
      address: false,
      password: false,
      name: false,
      confirmPassword: false
    });
  }, [authMode]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, form: '' }));
    setSuccessMsg('');

    // Mark all fields as touched to show errors
    const newTouched = {};
    Object.keys(touched).forEach(key => {
      newTouched[key] = true;
    });
    setTouched(newTouched);

    // Validate all fields
    const newErrors = { ...errors };
    Object.keys(authForm).forEach(key => {
      if (authMode === 'login' && !['email', 'password'].includes(key)) return;
      newErrors[key] = validateField(key, authForm[key]);
    });
    setErrors(newErrors);

    // Check if form is valid
    if (!isFormValid()) {
      setIsSubmitting(false);
      setErrors((prev) => ({ ...prev, form: 'Please fix the errors above' }));
      return;
    }

    try {
      if (authMode === 'login') {
        const formdata = {
          username: authForm.email,
          password: authForm.password
        };
        const data = await UserLogin(formdata);
        console.log('Login response:', data);

        if (data?.token) {
          if (data.role !== 'RECEIVER') {
            setErrors((prev) => ({ ...prev, form: 'Access denied. Only receiver can login here.' }));
            return;
          }
          localStorage.setItem(
            'user',
            JSON.stringify({
              role: data.role,
              userId: data.userid,
              token: data.token
            })
          );
          setIsLoggedIn(true);
          setSuccessMsg('Successfully logged in!');
          setTimeout(() => {
            setShowAuthModal(false);
            window.location.reload();
          }, 1500);
        } else {
          setErrors((prev) => ({ ...prev, form: data?.message || 'Invalid credentials. Please try again.' }));
        }
      } else {
        const formregdata = {
          username: authForm.name,
          mail: authForm.email,
          mobile: authForm.number,
          address: authForm.address,
          password: authForm.password,
          role: 'RECEIVER'
        };

        const data = await userRegister(formregdata);
        console.log('Registration response:', data);

        if (data?.token) {
          setSuccessMsg('Registration successful! Please login.');
          setTimeout(() => {
            toggleAuthMode();
          }, 1500);
        } else {
          setErrors((prev) => ({ ...prev, form: data?.message || 'Registration failed. Please try again.' }));
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors((prev) => ({ 
        ...prev, 
        form: error.response?.data?.message || 'Something went wrong. Please try again.' 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">
            {authMode === 'login' ? 'Login Required' : 'Create an Account'}
          </h2>
        </div>
        
        <div className="overflow-y-auto flex-grow p-6">
          <form onSubmit={handleAuthSubmit} className="space-y-4" noValidate>
            {authMode === 'register' && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={authForm.name}
                  onChange={handleAuthChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={authForm.email}
                onChange={handleAuthChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
            </div>

            {authMode === 'register' && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="number"
                    value={authForm.number}
                    onChange={handleAuthChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.number ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.number && <div className="text-red-500 text-sm mt-1">{errors.number}</div>}
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Address</label>
                  <textarea
                    name="address"
                    value={authForm.address}
                    onChange={handleAuthChange}
                    onBlur={handleBlur}
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.address && <div className="text-red-500 text-sm mt-1">{errors.address}</div>}
                </div>
              </>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={authForm.password}
                onChange={handleAuthChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
              {authMode === 'register' && (
                <div className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters with uppercase, lowercase, number, and special character
                </div>
              )}
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={authForm.confirmPassword}
                  onChange={handleAuthChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.confirmPassword && <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>}
              </div>
            )}

            {errors.form && <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">{errors.form}</div>}
            {successMsg && <div className="text-green-600 text-sm p-2 bg-green-50 rounded-md">{successMsg}</div>}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-sm text-green-600 hover:text-green-800"
              >
                {authMode === 'login'
                  ? 'Need an account? Register'
                  : 'Already have an account? Login'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleAuthSubmit}
              className="px-4 py-2 bg-[#0B8B68] text-white rounded-md hover:bg-[#0a7a5d] disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : authMode === 'login' ? 'Login' : 'Register'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiverLoginModal;