import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserLogin } from '../../API/LoginAPI/UserLogin';
import { userRegister } from '../../API/LoginAPI/UserRegister';

const RecipientsLogin = ({ requests, setRequests }) => {
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  console.log(requests);

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const formdata = {
        username: email,
        password,
      }
      const data = await UserLogin(formdata)

      if (data?.token) {
        if (data.role !== 'RECEIVER') {
          setMessage({ text: 'Access denied. Only receiver can login here.', type: "error" });
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
        setMessage({ text: "Login successful", type: "success" });
        setNavigating(true);

        // Redirect to form if there was a pending submission
        const pendingSubmission = localStorage.getItem('pendingRecipientRequest');
        setTimeout(() => navigate(pendingSubmission ? "/recipient/dashboard" : "/recipient/dashboard"), 1000);
      } else {
        setMessage({
          text: data?.message || "Login failed",
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

  const handleRegister = async (formData) => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Check if passwords match
      if (formData.password !== formData.confirmPassword) {
        setMessage({ text: "Passwords do not match", type: "error" });
        return;
      }

      const formregdata = {
        username: formData.name,
        mail: formData.email,
        mobile: formData.phone,
        address: formData.address,
        password: formData.password,
        role: "RECEIVER"
      }

      const data = await userRegister(formregdata);
      console.log("Registration response:", data);

      if (data?.token) {
        setMessage({ text: "Registration successful! Please login.", type: "success" });
        setIsLogin(true);
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

  const switchToLogin = () => { setIsLogin(true); window.scrollTo(0, 0); };
  const switchToRegister = () => { setIsLogin(false); window.scrollTo(0, 0); };

  if (navigating) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="flex items-center space-x-3">
          <svg
            className="animate-spin h-6 w-6 text-[#0B8B68]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-[#0B8B68] font-semibold">Redirecting...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="my-16 flex items-center justify-center">
      <div className="bg-white/40 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-center text-2xl font-semibold text-gray-900 mb-6">
          {isLogin ? "Recipient Login" : "Recipient Registration"}
        </h2>

        {message.text && (
          <div
            className={`mb-4 p-3 rounded text-sm text-center ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate field in real-time
    if (name === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    } else if (name === "password") {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields before submitting
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError
      });
      return;
    }
    
    handleSubmit(formData);
  };

  const isFormValid = formData.email && formData.password && !errors.email && !errors.password;

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
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
          className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#0B8B68] focus:outline-none ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
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
          className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#0B8B68] focus:outline-none ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>

      <button
        type="submit"
        disabled={loading || !isFormValid}
        className={`w-full bg-[#0B8B68] text-white py-2 rounded-md transition ${
          loading || !isFormValid ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Logging in...
          </span>
        ) : (
          "Login"
        )}
      </button>

      <div className="text-center mt-6 text-sm">
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
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: ""
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    address: false,
    password: false,
    confirmPassword: false
  });

  const validateName = (name) => {
    if (!name) return "Full name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone) return "Phone number is required";
    if (!phoneRegex.test(phone)) return "Please enter a valid Indian mobile number";
    return "";
  };

  const validateAddress = (address) => {
    if (!address) return "Address is required";
    if (address.length < 10) return "Address must be at least 10 characters";
    return "";
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) return "Password is required";
    if (!passwordRegex.test(password)) return "Must be at least 8 characters with uppercase, lowercase, number, and special character";
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate field in real-time
    if (touched[name]) {
      let error = "";
      switch (name) {
        case "name":
          error = validateName(value);
          break;
        case "email":
          error = validateEmail(value);
          break;
        case "phone":
          error = validatePhone(value);
          break;
        case "address":
          error = validateAddress(value);
          break;
        case "password":
          error = validatePassword(value);
          break;
        case "confirmPassword":
          error = validateConfirmPassword(value, formData.password);
          break;
        default:
          break;
      }
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    let error = "";
    switch (name) {
      case "name":
        error = validateName(formData.name);
        break;
      case "email":
        error = validateEmail(formData.email);
        break;
      case "phone":
        error = validatePhone(formData.phone);
        break;
      case "address":
        error = validateAddress(formData.address);
        break;
      case "password":
        error = validatePassword(formData.password);
        break;
      case "confirmPassword":
        error = validateConfirmPassword(formData.confirmPassword, formData.password);
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
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
      confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password)
    };
    
    setErrors(newErrors);
    
    // Check if form is valid
    const isFormValid = Object.values(newErrors).every(error => error === "");
    
    if (isFormValid) {
      handleSubmit(formData);
    }
  };

  const isFormValid = Object.values(errors).every(error => error === "") && 
                     Object.values(formData).every(value => value !== "");

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
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
          className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#0B8B68] focus:outline-none ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
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
          className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#0B8B68] focus:outline-none ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
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
          className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#0B8B68] focus:outline-none ${
            errors.phone ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
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
          className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#0B8B68] focus:outline-none ${
            errors.address ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
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
          className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#0B8B68] focus:outline-none ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        <div className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters with uppercase, lowercase, number, and special character
                </div>
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
          className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#0B8B68] focus:outline-none ${
            errors.confirmPassword ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
      </div>

      <button
        type="submit"
        disabled={loading || !isFormValid}
        className={`w-full bg-[#0B8B68] text-white py-2 rounded-md transition ${
          loading || !isFormValid ? "opacity-70 cursor-not-allowed" : ""
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

      <div className="text-center mt-6 text-sm">
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

export default RecipientsLogin;