// src/components/RecipientsRequestForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { submitRecipientRequest, checkReceiverAuth } from '../../API/Receiver API/ReceiverRequest';
import ReceiverLoginModal from './ReceiverLoginModal';

const RecipientsRequestForm = () => {
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
      const id = JSON.parse(user).userId;
      localStorage.setItem('receiverId', id);

      const data = {
        Receiverid: id,
        patientname: formData.patientName,
        age: formData.age,
        gender: formData.gender,
        medicalproblem: formData.medicalProblem,
        medicalreport: formData.medicalReports,
        identificationproof: formData.identificationProof,
        number: formData.phoneNumber,
        donationamount: formData.donationAmount,
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
      <span className="text-sm text-gray-600">{file.name}</span>
    ) : (
      <span className="text-sm text-gray-400">No file chosen</span>
    );
  };

  // Helper to determine if a field should show error
  const shouldShowError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  return (
    <div className="max-w-7xl mx-auto my-11 bg-white p-5 md:p-0">
      {/* Authentication Modal */}
      {showAuthModal && (
        <ReceiverLoginModal 
          authMode={authMode} 
          toggleAuthMode={toggleAuthMode} 
          setShowAuthModal={setShowAuthModal}
          onSuccess={() => setIsLoggedIn(true)}
        />
      )}

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Recipients Request Form</h1>
      
      {/* Status Message */}
      {submitStatus.message && (
        <div className={`mb-6 p-4 rounded-md ${
          submitStatus.success 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {submitStatus.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className='p-6 rounded-lg border border-gray-200 shadow-md'>
        {/* Patient Name & Age */}
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Patient Name*</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-4 border ${shouldShowError('patientName') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              required
            />
            {shouldShowError('patientName') && <p className="text-red-500 text-sm mt-1">{errors.patientName}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Age*</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              onBlur={handleBlur}
              min="1"
              max="100"
              className={`w-full px-4 py-4 border ${shouldShowError('age') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              required
            />
            {shouldShowError('age') && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
          </div>
        </div>

        {/* Gender & Phone */}
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Gender*</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-4 border ${shouldShowError('gender') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {shouldShowError('gender') && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone Number*</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              pattern="[0-9]{10}"
              maxLength="10"
              className={`w-full px-4 py-4 border ${shouldShowError('phoneNumber') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              required
            />
            {shouldShowError('phoneNumber') && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>
        </div>

        {/* Medical Problem & Donation */}
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Medical Problem</label>
            <input
              type="text"
              name="medicalProblem"
              value={formData.medicalProblem}
              onChange={handleChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Donation Amount (₹)</label>
            <input
              type="text"
              name="donationAmount"
              value={formData.donationAmount}
              onChange={handleChange}
              onBlur={handleBlur}
              pattern="^\d+(\.\d{1,2})?$"
              className={`w-full px-4 py-4 border ${shouldShowError('donationAmount') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="e.g. 5000 or 5000.50"
            />
            {shouldShowError('donationAmount') && <p className="text-red-500 text-sm mt-1">{errors.donationAmount}</p>}
          </div>
        </div>

        {/* Message Box */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            placeholder="Write your message here..."
            className="w-full px-4 py-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* File Uploads */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Medical Reports/Diagnosis*</label>
            <div className="flex flex-col">
              <div className="flex items-center">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md border border-gray-300 transition">
                  <span>Choose File</span>
                  <input
                    type="file"
                    name="medicalReports"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                </label>
                <span className="ml-2 text-sm">
                  {getFileInputLabel(formData.medicalReports, shouldShowError('medicalReports') && errors.medicalReports)}
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-1">Max 2MB (PDF, JPG, PNG)</p>
              {shouldShowError('medicalReports') && <p className="text-red-500 text-sm mt-1">{errors.medicalReports}</p>}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Identification Proof*</label>
            <div className="flex flex-col">
              <div className="flex items-center">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md border border-gray-300 transition">
                  <span>Choose File</span>
                  <input
                    type="file"
                    name="identificationProof"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                </label>
                <span className="ml-2 text-sm">
                  {getFileInputLabel(formData.identificationProof, shouldShowError('identificationProof') && errors.identificationProof)}
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-1">Max 2MB (PDF, JPG, PNG)</p>
              {shouldShowError('identificationProof') && <p className="text-red-500 text-sm mt-1">{errors.identificationProof}</p>}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Patient Image (Optional)</label>
            <div className="flex flex-col">
              <div className="flex items-center">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md border border-gray-300 transition">
                  <span>Choose File</span>
                  <input
                    type="file"
                    name="applicationFile"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="hidden"
                    accept=".jpg,.jpeg,.png"
                  />
                </label>
                <span className="ml-2 text-sm">
                  {getFileInputLabel(formData.applicationFile, shouldShowError('applicationFile') && errors.applicationFile)}
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-1">Max 2MB (JPG, PNG)</p>
              {shouldShowError('applicationFile') && <p className="text-red-500 text-sm mt-1">{errors.applicationFile}</p>}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-6">
          <button
            type="submit"
            className="hover:text-[#0B8B68] transition duration-300 bg-[#0B8B68] hover:bg-white border border-white hover:border-[#0B8B68] text-white rounded-[6px] w-1/2 font-bold py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
          <p className="mt-4 text-green-700">
            We will review your request and contact you.
          </p>
          <p className="text-gray-500 text-sm mt-2">* indicates required fields</p>
        </div>
      </form>
    </div>
  );
};

export default RecipientsRequestForm;