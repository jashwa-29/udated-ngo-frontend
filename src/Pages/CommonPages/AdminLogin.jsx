import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserLogin } from "../../API/LoginAPI/UserLogin";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
         const formdata = {    username: email,
        password,

      }
    const  data  = await UserLogin(formdata)
  
        if (data?.token) {
            if (data.role !== 'ADMIN') {
          setMessage({ text: 'Access denied. Only admin can login here.'});
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
        setTimeout(() => navigate("/admin/dashboard"), 1000);
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

  // Full screen loader when navigating
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
          <span className="text-[#0B8B68] font-semibold">Redirecting to Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="my-16 flex items-center justify-center">
      <div className="bg-white/40 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-center text-2xl font-semibold text-gray-900 mb-6">
          Admin Login
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

        <LoginForm handleSubmit={handleLogin} loading={loading} />
      </div>
    </div>
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
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#0B8B68] focus:outline-none"
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
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#0B8B68] focus:outline-none"
        />
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
    </form>
  );
};

export default AdminLogin;
