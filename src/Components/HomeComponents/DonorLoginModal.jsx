import React, { useState, useEffect } from "react";
import { UserLogin } from '../../API/LoginAPI/UserLogin';
import { userRegister } from '../../API/LoginAPI/UserRegister';


const DonorLoginModal = ({ setShowAuthModal, handleAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loginSuccess, setLoginSuccess] = useState(false);



  const handleLogin = async (formData) => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const formdata = {    
        username: formData.email,
        password: formData.password,
      };
      
      // Use mock function for demonstration
      const data = await UserLogin(formdata);
      // In your actual code, use: const data = await UserLogin(formdata);

      if (data?.token) {
        if (data.role !== 'DONOR') {
          setMessage({ text: 'Access denied. Only donor can login here.', type: "error" });
          setLoading(false);
          return;
        }
        
        localStorage.setItem(
          "user",
          JSON.stringify({
            role: data.role,
            userId: data.userid,
            token: data.token,
          })
        );
        
        setMessage({ text: "Login successful! Redirecting...", type: "success" });
        setLoginSuccess(true);
        handleAuthSuccess();
        
        // Close modal after showing success message for 1.5 seconds
        setTimeout(() => setShowAuthModal(false), 1500);
      } else {
        setMessage({
          text: data?.message || "Login failed",
          type: "error",
        });
        setLoginSuccess(false);
      }
    } catch (error) {
      setLoginSuccess(false);
      if (error.response?.status === 401) {
        setMessage({ text: "Incorrect credentials. Please try again.", type: "error" });
      } else {
        setMessage({
          text: error.response?.data?.message || "An unexpected error occurred.",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Check if passwords match
      if (formData.password !== formData.confirmPassword) {
        setMessage({ text: "Passwords do not match", type: "error" });
        setLoading(false);
        return;
      }

      const formregdata = {
        username: formData.name,
        mail: formData.email,
        mobile: formData.phone,
        address: formData.address,
        password: formData.password,
        role: "DONOR"
      };

      // Use mock function for demonstration
      const data = await userRegister(formregdata);
      // In your actual code, use: const data = await userRegister(formregdata);
      
      if (data?.token) {
        setMessage({ text: "Registration successful! Please login.", type: "success" });
        setIsLogin(true); // Switch to login form after successful registration
      } else {
        setMessage({
          text: data?.message || "Registration failed",
          type: "error",
        });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage({ text: "Incorrect credentials. Please try again.", type: "error" });
      } else {
        setMessage({
          text: error.response?.data?.message || "An unexpected error occurred.",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setMessage({ text: "", type: "" });
    setLoginSuccess(false);
  };
  
  const switchToRegister = () => {
    setIsLogin(false);
    setMessage({ text: "", type: "" });
    setLoginSuccess(false);
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {isLogin ? "Donor Login" : "Donor Registration"}
          </h3>
          <button
            onClick={handleCloseModal}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            disabled={loading}
          >
            &times;
          </button>
        </div>

        {message.text && (
          <div className={`mb-4 p-3 rounded text-sm text-center ${
            message.type === "success" 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        {!loginSuccess ? (
          <>
            {isLogin ? (
              <LoginForm 
                handleSubmit={handleLogin} 
                loading={loading}
                switchToRegister={switchToRegister}
              />
            ) : (
              <RegisterForm 
                handleSubmit={handleRegister} 
                loading={loading}
                switchToLogin={switchToLogin}
              />
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <p className="text-gray-700">Login successful! You will be redirected shortly.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const LoginForm = ({ handleSubmit, loading, switchToRegister }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  // Validation functions
  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  // Handle input change with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate on type
    if (touched[name]) {
      let error = "";
      if (name === "email") error = validateEmail(value);
      if (name === "password") error = validatePassword(value);
      
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Handle blur event to mark field as touched
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate on blur
    let error = "";
    if (name === "email") error = validateEmail(value);
    if (name === "password") error = validatePassword(value);
    
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to show errors
    const newTouched = {};
    Object.keys(formData).forEach(key => {
      newTouched[key] = true;
    });
    setTouched(newTouched);
    
    // Validate all fields
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };
    setErrors(newErrors);
    
    // Check if form is valid
    const isValid = Object.values(newErrors).every(error => error === "");
    
    if (isValid) {
      handleSubmit(formData);
    }
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-800">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#0B8B68] focus:outline-none ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-800">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#0B8B68] focus:outline-none ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-[#0B8B68] text-white py-2 rounded-md hover:bg-[#0B8B68] transition ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Logging in...
          </span>
        ) : (
          "Login"
        )}
      </button>

      <div className="text-center mt-4 text-sm">
        <span>
          Don't have an account?{" "}
          <button
            type="button"
            onClick={switchToRegister}
            className="text-black font-medium hover:underline"
          >
            Register
          </button>
        </span>
      </div>
    </form>
  );
};

const RegisterForm = ({ handleSubmit, loading, switchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    address: false,
    password: false,
    confirmPassword: false,
  });

  // Validation functions
  const validateName = (name) => {
    if (!name) return "Full name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone) return "Phone number is required";
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
    if (!phoneRegex.test(phone)) return "Please enter a valid phone number";
    if (phone.replace(/\D/g, '').length < 10) return "Phone number must be at least 10 digits";
    return "";
  };

  const validateAddress = (address) => {
    if (!address) return "Address is required";
    if (address.length < 5) return "Address must be at least 5 characters";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number";
    if (!/(?=.*[@$!%*?&])/.test(password)) return "Password must contain at least one special character";
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };

  // Handle input change with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate on type
    if (touched[name]) {
      let error = "";
      if (name === "name") error = validateName(value);
      if (name === "email") error = validateEmail(value);
      if (name === "phone") error = validatePhone(value);
      if (name === "address") error = validateAddress(value);
      if (name === "password") error = validatePassword(value);
      if (name === "confirmPassword") error = validateConfirmPassword(value, formData.password);
      
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Handle blur event to mark field as touched
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate on blur
    let error = "";
    if (name === "name") error = validateName(value);
    if (name === "email") error = validateEmail(value);
    if (name === "phone") error = validatePhone(value);
    if (name === "address") error = validateAddress(value);
    if (name === "password") error = validatePassword(value);
    if (name === "confirmPassword") error = validateConfirmPassword(value, formData.password);
    
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to show errors
    const newTouched = {};
    Object.keys(formData).forEach(key => {
      newTouched[key] = true;
    });
    setTouched(newTouched);
    
    // Validate all fields
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      address: validateAddress(formData.address),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
    };
    setErrors(newErrors);
    
    // Check if form is valid
    const isValid = Object.values(newErrors).every(error => error === "");
    
    if (isValid) {
      handleSubmit(formData);
    }
  };

  return (
    <form className="space-y-3" onSubmit={onSubmit} noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-800">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#0B8B68] focus:outline-none ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-800">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#0B8B68] focus:outline-none ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-800">
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#0B8B68] focus:outline-none ${
            errors.phone ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your phone number"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-800">
          Address
        </label>
        <input
          type="text"
          name="address"
          id="address"
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#0B8B68] focus:outline-none ${
            errors.address ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your address"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-800">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#0B8B68] focus:outline-none ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Create a password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Must be at least 8 characters with uppercase, lowercase, number, and special character
        </p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#0B8B68] focus:outline-none ${
            errors.confirmPassword ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-[#0B8B68] text-white py-2 rounded-md transition ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Registering...
          </span>
        ) : (
          "Register"
        )}
      </button>

      <div className="text-center mt-4 text-sm">
        <span>
          Already have an account?{" "}
          <button
            type="button"
            onClick={switchToLogin}
            className="text-black font-medium hover:underline"
          >
            Login
          </button>
        </span>
      </div>
    </form>
  );
};

export default DonorLoginModal;