import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserLogin } from "../../API/LoginAPI/UserLogin";
import { SendForgotPasswordOTP, ResetPassword } from "../../API/LoginAPI/ForgotPassword";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showForgot, setShowForgot] = useState(false); // modal visibility
  const [forgotStep, setForgotStep] = useState(1); // 1: OTP, 2: Reset
  const navigate = useNavigate();

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const formdata = { username: email, password };
      const data = await UserLogin(formdata);

      if (data?.token) {
        if (data.role !== "ADMIN") {
          setMessage({ text: "Access denied. Only admin can login here." });
          return;
        }
        // Store user data with correct field names matching backend response
        localStorage.setItem(
          "user",
          JSON.stringify({
            userid: data.userid,      // Backend returns 'userid' (lowercase)
            username: data.username,
            email: data.email,
            role: data.role,
            token: data.token,
          })
        );
        setMessage({ text: "Login successful", type: "success" });
        setNavigating(true);
        setTimeout(() => navigate("/admin/dashboard"), 1000);
      } else {
        setMessage({
          text: data?.message || "Login failed",
          type: "error",
        });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage({
          text: "Incorrect credentials. Please try again.",
          type: "error",
        });
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

  // Forgot Password Submit
  const handleForgotSubmit = async (email) => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await SendForgotPasswordOTP({ email });
      if (res.success) {
        setMessage({ text: res.message, type: "success" });
        setForgotStep(2);
      } else {
        setMessage({ text: res.message, type: "error" });
      }
    } catch (error) {
      setMessage({
        text: "Failed to send OTP. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (data) => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await ResetPassword(data);
      if (res.success) {
        setMessage({ text: res.message, type: "success" });
        setTimeout(() => {
          setLoading(false);
          setShowForgot(false);
          setForgotStep(1);
          navigate('/login'); // Navigate to main login page
        }, 2000);
      } else {
        setMessage({ text: res.message, type: "error" });
        setLoading(false);
      }
    } catch (error) {
      setMessage({
        text: "Failed to reset password. Please try again.",
        type: "error",
      });
      setLoading(false);
    }
  };

  // Full screen loader when navigating
  if (navigating) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="flex items-center space-x-3">
          <svg
            className="animate-spin h-6 w-6 text-[#4D9186]"
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
          <span className="text-[#4D9186] font-semibold">
            Redirecting to Dashboard...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 lg:pt-36 pb-10 min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white flex items-center justify-center px-4">
      <div className="bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/80 w-full max-w-md relative overflow-hidden transition-all duration-300 hover:shadow-[0_22px_60px_rgba(77,145,134,0.12)]">
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#4D9186]/5 rounded-full -mr-16 -mt-16" />
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-[#4D9186]/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-8 h-8 text-[#4D9186]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3m0 0a10.003 10.003 0 0111.446 12.59h-4.663c-1.153 0-1.902.553-2.025 1.488A8.002 8.002 0 0112 11z" />
            </svg>
          </div>

          <h1 className='text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#4D9186] to-[#3d7a70]'>
            Admin Portal
          </h1>
          <p className="text-center text-gray-500 mb-8">Enter your credentials to manage the platform</p>

          {message.text && (
            <div
              className={`mb-6 p-4 rounded-xl text-sm text-center font-medium animate-in fade-in slide-in-from-top-2 duration-300 ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : "bg-red-50 text-red-700 border border-red-100"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {message.type === "success" ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                )}
                {message.text}
              </div>
            </div>
          )}

          <LoginForm handleSubmit={handleLogin} loading={loading} />

        {/* Forgot password link */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => {
              setShowForgot(true);
              setForgotStep(1);
              setMessage({ text: "", type: "" });
            }}
            className="text-[#4D9186] text-sm hover:underline"
          >
            Forgot Password?
          </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal/Overlay */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-md relative">
            <button 
              onClick={() => setShowForgot(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-center text-2xl font-semibold text-gray-900 mb-6">
              {forgotStep === 1 ? "Forgot Password" : "Reset Password"}
            </h2>
            <ForgotPasswordForm
              step={forgotStep}
              handleSendOTP={handleForgotSubmit}
              handleResetPassword={handleResetPassword}
              loading={loading}
              backToLogin={() => setShowForgot(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Forgot Password Form Component (Same as Donor/Recipient)
const ForgotPasswordForm = ({ step, handleSendOTP, handleResetPassword, loading, backToLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validateOTP = (otp) => {
    if (!otp) return "OTP is required";
    if (otp.length !== 6) return "OTP must be 6 digits";
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

    let error = "";
    switch (name) {
      case "email": error = validateEmail(value); break;
      case "otp": error = validateOTP(value); break;
      case "newPassword": error = validatePassword(value); break;
      case "confirmPassword": error = validateConfirmPassword(value, formData.newPassword); break;
      default: break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSendOTPSubmit = (e) => {
    e.preventDefault();
    const emailError = validateEmail(formData.email);
    if (emailError) { setErrors({ email: emailError }); return; }
    handleSendOTP(formData.email);
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    const otpError = validateOTP(formData.otp);
    const passwordError = validatePassword(formData.newPassword);
    const confirmError = validateConfirmPassword(formData.confirmPassword, formData.newPassword);
    if (otpError || passwordError || confirmError) {
      setErrors({ otp: otpError, newPassword: passwordError, confirmPassword: confirmError });
      return;
    }
    handleResetPassword({
      email: formData.email,
      otp: formData.otp,
      newPassword: formData.newPassword
    });
  };

  const isStep1Valid = formData.email && !errors.email;
  const isStep2Valid = formData.otp && formData.newPassword && formData.confirmPassword && 
                      !errors.otp && !errors.newPassword && !errors.confirmPassword;

  return (
    <form className="space-y-6" onSubmit={step === 1 ? handleSendOTPSubmit : handleResetPasswordSubmit}>
      {step === 1 ? (
        <>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#4D9186] focus:outline-none ${errors.email ? "border-red-500" : "border-gray-300"}`}
              placeholder="Enter your registered email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <button
            type="submit"
            disabled={loading || !isStep1Valid}
            className={`w-full bg-[#4D9186] text-white py-2 rounded-md transition ${loading || !isStep1Valid ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending OTP...
              </span>
            ) : "Send OTP"}
          </button>
        </>
      ) : (
        <>
          <div className="bg-blue-50 p-3 rounded-md mb-4">
            <p className="text-sm text-blue-700">OTP sent to: <strong>{formData.email}</strong></p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800">OTP</label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                maxLength={6}
                className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#4D9186] focus:outline-none ${errors.otp ? "border-red-500" : "border-gray-300"}`}
                placeholder="6-digit OTP"
              />
              {errors.otp && <p className="mt-1 text-sm text-red-600">{errors.otp}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#4D9186] focus:outline-none ${errors.newPassword ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#4D9186] focus:outline-none ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !isStep2Valid}
            className={`w-full bg-[#4D9186] text-white py-2 rounded-md transition ${loading || !isStep2Valid ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting Password...
              </span>
            ) : "Reset Password"}
          </button>
        </>
      )}
      <div className="text-center mt-4">
        <button type="button" onClick={backToLogin} className="text-black font-medium hover:underline text-sm">Back to Login</button>
      </div>
    </form>
  );
};

const LoginForm = ({ handleSubmit, loading }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  const isFormValid = formData.email && formData.password;

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
          required
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#4D9186] focus:outline-none"
        />
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
          required
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#4D9186] focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !isFormValid}
        className={`w-full bg-[#4D9186] text-white py-2 rounded-md transition ${
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
    </form>
  );
};

export default AdminLogin;
