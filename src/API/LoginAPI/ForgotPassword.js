const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from "axios";

// Step 1: Send OTP to registered email
export const SendForgotPasswordOTP = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/forgot-password`, data, {
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true, // prevent Axios from throwing automatically
    });

    // Check status manually
    if (response.status === 200) {
      return { success: true, message: response.data.message || "OTP sent successfully!" };
    } else if (response.status === 404) {
      return { success: false, message: "Email not found. Please use a registered email." };
    } else if (response.status === 403) {
      return { success: false, message: "Access forbidden or invalid request." };
    } else {
      return { success: false, message: response.data || "Unexpected error occurred." };
    }
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    throw error;
  }
};

// Step 2: Verify OTP and Reset Password
export const ResetPassword = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reset-password`, data, {
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true,
    });

    if (response.status === 200) {
      return { success: true, message: response.data.message || "Password reset successful!" };
    } else if (response.status === 400) {
      return { success: false, message: "Invalid OTP or missing data." };
    } else if (response.status === 403) {
      return { success: false, message: "Unauthorized or expired OTP." };
    } else if (response.status === 404) {
      return { success: false, message: "User not found." };
    } else {
      return { success: false, message: response.data || "Unexpected error occurred." };
    }
  } catch (error) {
    console.error("Error resetting password:", error.message);
    throw error;
  }
};
