// src/components/RecipientsRequestForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { submitRecipientRequest, checkReceiverAuth } from '../../API/Receiver API/ReceiverRequest';
import ReceiverLoginModal from './ReceiverLoginModal';
import { useCurrency } from '../../context/CurrencyContext';

// Helper function - moved outside to prevent recreation
const shouldShowError = (touched, errors, fieldName) => {
  return touched[fieldName] && errors[fieldName];
};

// InputField component - MOVED OUTSIDE to fix one-letter typing bug
const InputField = ({ label, name, type = "text", required = false, formData, handleChange, handleBlur, touched, errors, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={formData[name] || ''}
      className={`w-full px-4 py-3 rounded-lg border ${
        shouldShowError(touched, errors, name) ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
      } focus:outline-none focus:ring-4 transition-all duration-200 bg-gray-50 focus:bg-white`}
      onChange={handleChange}
      onBlur={handleBlur}
      {...props}
    />
    {shouldShowError(touched, errors, name) && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
  </div>
);

// FileInput component - MOVED OUTSIDE to fix one-letter typing bug
const FileInput = ({ label, name, required = false, accept, formData, handleChange, handleBlur, touched, errors, getFileInputLabel }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
      shouldShowError(touched, errors, name) ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary bg-gray-50 hover:bg-white'
    }`}>
      <input
        type="file"
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept={accept}
        required={required}
      />
      <div className="flex flex-col items-center justify-center text-center">
        <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-primary">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {getFileInputLabel(formData[name], shouldShowError(touched, errors, name) && errors[name])}
        </p>
      </div>
    </div>
  </div>
);

const RecipientsRequestForm = () => {
  const { currency, exchangeRate } = useCurrency();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  const [formData, setFormData] = useState({
    patientName: '',
    gender: '',
    medicalProblem: '',
    medicalReports: null,
    identificationProof: null,
    age: '',
    phoneNumber: '',
    donationAmount: '',
    other: '',
    applicationFile: null,
    message: ''
  });

  useEffect(() => {
    setIsLoggedIn(checkReceiverAuth());
  }, []);

  // Validation rules for each field
  const validationRules = {
    patientName: (value) => {
      if (!value.trim()) return 'Patient name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return null;
    },
    gender: (value) => {
      if (!value) return 'Gender is required';
      return null;
    },
    age: (value) => {
      if (!value) return 'Age is required';
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 1 || numValue > 100) return 'Age must be between 1 and 100';
      return null;
    },
    phoneNumber: (value) => {
      if (!value) return 'Phone number is required';
      if (!/^[0-9]{10}$/.test(value)) return 'Phone number must be 10 digits';
      return null;
    },
    donationAmount: (value) => {
      if (value && !/^\d+(\.\d{1,2})?$/.test(value)) return 'Invalid amount format';
      return null;
    },
    medicalReports: (file) => {
      if (!file) return 'Medical reports are required';
      if (file.size > MAX_FILE_SIZE) return 'File size must be less than 2MB';
      return null;
    },
    identificationProof: (file) => {
      if (!file) return 'ID proof is required';
      if (file.size > MAX_FILE_SIZE) return 'File size must be less than 2MB';
      return null;
    },
    applicationFile: (file) => {
      if (file && file.size > MAX_FILE_SIZE) return 'File size must be less than 2MB';
      return null;
    }
  };

  // Validate a single field
  const validateField = useCallback((name, value) => {
    const validator = validationRules[name];
    return validator ? validator(value) : null;
  }, []);

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  // Validate field on change and mark as touched
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [formData, validateField]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    // If user is not logged in and interacts with any field, show auth modal
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    
    let newValue = value;
    
    // Handle file inputs
    if (files) {
      // Check file size
      if (files[0] && files[0].size > MAX_FILE_SIZE) {
        setErrors(prev => ({ ...prev, [name]: 'File size must be less than 2MB' }));
        setTouched(prev => ({ ...prev, [name]: true }));
        return;
      }
      
      newValue = files[0];
    }
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Real-time validation for touched fields
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    
    // Mark all fields as touched to show errors
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors).find(key => errors[key]);
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
      return;
    }

    const user = localStorage.getItem('user');
    if (!user) {
      setSubmitStatus({ 
        success: false, 
        message: 'User session expired. Please login again.' 
      });
      return;
    }

    try {
      // Note: Backend extracts user ID from JWT token, so we don't need to send it
      // But we'll keep it in localStorage for frontend reference
      const userData = JSON.parse(user);
      const id = userData.userid || userData.userId; // Support both formats
      localStorage.setItem('receiverId', id);

      const requestedAmount = parseFloat(formData.donationAmount) || 0;
      const finalDonationAmount = (currency === 'USD' && exchangeRate) 
        ? (requestedAmount / exchangeRate).toFixed(0) 
        : requestedAmount.toString();

      const data = {
        // Receiverid is NOT needed - backend gets it from JWT token
        patientname: formData.patientName,
        age: formData.age,
        gender: formData.gender,
        medicalproblem: formData.medicalProblem,
        medicalreport: formData.medicalReports,
        identificationproof: formData.identificationProof,
        number: formData.phoneNumber,
        donationamount: finalDonationAmount,
        otherproof: formData.applicationFile,
        overview: formData.message
      };
      
      setIsSubmitting(true);
      setSubmitStatus({ success: false, message: '' });
      
      await submitRecipientRequest(data);
      
      setSubmitStatus({ 
        success: true, 
        message: 'Request submitted successfully! We will contact you soon.' 
      });
      
      // Reset form after successful submission
      setFormData({
        patientName: '',
        gender: '',
        medicalProblem: '',
        medicalReports: null,
        identificationProof: null,
        age: '',
        phoneNumber: '',
        donationAmount: '',
        other: '',
        applicationFile: null,
        message: ''
      });
      
      // Reset touched state
      setTouched({});
    } catch (error) {
      setSubmitStatus({ 
        success: false, 
        message: error.message || 'Failed to submit request. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
      localStorage.setItem('pendingRecipientRequest', false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'login' ? 'register' : 'login');
  };

  const getFileInputLabel = (file, error) => {
    if (error) {
      return <span className="text-sm text-red-500">{error}</span>;
    }
    return file ? (
      <span className="text-sm text-gray-900 font-medium truncate max-w-[200px]">{file.name}</span>
    ) : (
      <span className="text-sm text-gray-400">No file chosen</span>
    );
  };

  // Components are now defined outside - removed from here

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Authentication Modal */}
      {showAuthModal && (
        <ReceiverLoginModal 
          authMode={authMode} 
          toggleAuthMode={toggleAuthMode} 
          setShowAuthModal={setShowAuthModal}
          onSuccess={() => setIsLoggedIn(true)}
        />
      )}
      
      {/* Status Message */}
      {submitStatus.message && (
        <div className={`p-4 ${
          submitStatus.success 
            ? 'bg-green-50 text-green-700 border-b border-green-100' 
            : 'bg-red-50 text-red-700 border-b border-red-100'
        }`}>
          <div className="flex items-center justify-center">
            {submitStatus.success ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
            )}
            {submitStatus.message}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Personal Details</h4>
            
            <InputField 
              label="Patient Name" 
              name="patientName" 
              required 
              placeholder="Full Name"
              formData={formData}
              handleChange={handleChange}
              handleBlur={handleBlur}
              touched={touched}
              errors={errors}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <InputField 
                label="Age" 
                name="age" 
                type="number" 
                required 
                min="1" 
                max="100"
                formData={formData}
                handleChange={handleChange}
                handleBlur={handleBlur}
                touched={touched}
                errors={errors}
              />
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    shouldShowError('gender') ? 'border-red-500' : 'border-gray-200'
                  } focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white`}
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {shouldShowError('gender') && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
              </div>
            </div>

            <InputField 
              label="Phone Number" 
              name="phoneNumber" 
              type="tel" 
              required 
              placeholder="10-digit number"
              maxLength="10"
              formData={formData}
              handleChange={handleChange}
              handleBlur={handleBlur}
              touched={touched}
              errors={errors}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Medical Details</h4>
            
            <InputField 
              label="Medical Problem" 
              name="medicalProblem" 
              placeholder="Brief description"
              formData={formData}
              handleChange={handleChange}
              handleBlur={handleBlur}
              touched={touched}
              errors={errors}
            />
            
            <InputField 
              label={`Amount Required (${currency === 'USD' ? '$' : '₹'})`} 
              name="donationAmount" 
              placeholder={currency === 'USD' ? "e.g. 500" : "e.g. 50000"}
              formData={formData}
              handleChange={handleChange}
              handleBlur={handleBlur}
              touched={touched}
              errors={errors}
            />
            {currency === 'USD' && formData.donationAmount && exchangeRate && (
              <p className="text-[10px] font-bold text-[#4D9186] uppercase tracking-wider -mt-3 mb-4 bg-emerald-50 p-2 rounded-lg border border-emerald-100 italic">
                ≈ ₹{Math.round(parseFloat(formData.donationAmount) / exchangeRate).toLocaleString()} INR (Target Goal)
              </p>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us more about your situation..."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 focus:bg-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* File Uploads Section */}
        <div className="mt-8">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Documents</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FileInput 
              label="Medical Reports" 
              name="medicalReports" 
              required 
              accept=".pdf,.jpg,.jpeg,.png"
              formData={formData}
              handleChange={handleChange}
              handleBlur={handleBlur}
              touched={touched}
              errors={errors}
              getFileInputLabel={getFileInputLabel}
            />
            <FileInput 
              label="ID Proof" 
              name="identificationProof" 
              required 
              accept=".pdf,.jpg,.jpeg,.png"
              formData={formData}
              handleChange={handleChange}
              handleBlur={handleBlur}
              touched={touched}
              errors={errors}
              getFileInputLabel={getFileInputLabel}
            />
            <FileInput 
              label="Patient Photo" 
              name="applicationFile" 
              accept=".jpg,.jpeg,.png"
              formData={formData}
              handleChange={handleChange}
              handleBlur={handleBlur}
              touched={touched}
              errors={errors}
              getFileInputLabel={getFileInputLabel}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center">
          <button
            type="submit"
            className="w-full md:w-1/3 py-4 px-8 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Submit Request'}
          </button>
          <p className="mt-4 text-sm text-gray-500">
            By submitting, you agree to our terms and conditions.
          </p>
        </div>
      </form>
    </div>
  );
};

export default RecipientsRequestForm;