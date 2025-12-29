import React, { useState } from 'react';
import { submitContactForm } from '../../API/ContactAPI';
import { toast } from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', or null
  const [loading, setLoading] = useState(false);

  // Validation patterns
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[6-9]\d{9}$/; // Basic Indian mobile number validation (10 digits starting with 6-9)
  const namePattern = /^[a-zA-Z\s]{2,}$/;
  
  const validate = (values) => {
    const newErrors = {};
    
    if (!values.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!namePattern.test(values.name)) {
      newErrors.name = 'Name should contain at least 2 letters';
    }

    if (!values.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailPattern.test(values.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!values.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const cleanPhone = values.phone.replace(/[^\d]/g, '');
      const finalPhone = (cleanPhone.length === 12 && cleanPhone.startsWith('91')) 
        ? cleanPhone.slice(2) 
        : cleanPhone;
        
      if (!phonePattern.test(finalPhone)) {
        newErrors.phone = 'Please enter a valid 10-digit Indian mobile number';
      }
    }

    if (!values.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!values.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (values.message.length < 10) {
      newErrors.message = 'Message should be at least 10 characters long';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing if field was previously invalid
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    const validationErrors = validate(formData);
    setErrors(validationErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const response = await submitContactForm(formData);
        toast.success(response.message || 'Message sent successfully!');
        setSubmissionStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: ''
        });
        setTouched({});
        
        // Reset success message after 5 seconds
        setTimeout(() => setSubmissionStatus(null), 5000);
      } catch (error) {
        console.error('Form submission error:', error);
        toast.error(error.response?.data?.message || 'Failed to send message');
        setSubmissionStatus('error');
      } finally {
        setLoading(false);
      }
    } else {
      setSubmissionStatus('error');
    }
  };

  return (
    <section className="py-10 sm:py-16 lg:py-16 pt-28 lg:pt-36 bg-gray-50">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl font-heading">
            Contact <span className='text-primary'>Us</span>
          </h2>
          <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-secondary">
            We'd love to hear from you. Please fill out the form below or reach out to us directly.
          </p>
        </div>

        <div className="max-w-6xl mx-auto mt-12 overflow-hidden bg-white rounded-xl shadow-xl lg:mt-20">
          <div className="grid items-stretch grid-cols-1 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="p-6 sm:p-10">
                <h3 className="text-2xl font-semibold text-gray-900 font-heading">Send us a message</h3>

                {submissionStatus === 'success' && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-700 font-medium">Thank you! Your message has been sent successfully.</p>
                  </div>
                )}
                
                {submissionStatus === 'error' && Object.keys(errors).length > 0 && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700 font-medium">Please fix the errors below and try again.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                    <div>
                      <label htmlFor="name" className="text-base font-medium text-gray-900"> Your name </label>
                      <div className="mt-2.5 relative">
                        <input 
                          type="text" 
                          name="name" 
                          id="name" 
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your full name"
                          className={`block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 border rounded-md bg-gray-50 focus:outline-none focus:bg-white caret-primary ${
                            touched.name && errors.name 
                              ? 'border-red-500 focus:border-red-500' 
                              : 'border-gray-200 focus:border-primary'
                          }`}
                        />
                        {touched.name && errors.name && (
                          <p className="mt-1 text-sm text-red-500 font-medium animate-pulse">{errors.name}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="text-base font-medium text-gray-900"> Your email </label>
                      <div className="mt-2.5 relative">
                        <input 
                          type="email" 
                          name="email" 
                          id="email" 
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your email address"
                          className={`block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 border rounded-md bg-gray-50 focus:outline-none focus:bg-white caret-primary ${
                            touched.email && errors.email 
                              ? 'border-red-500 focus:border-red-500' 
                              : 'border-gray-200 focus:border-primary'
                          }`}
                        />
                        {touched.email && errors.email && (
                          <p className="mt-1 text-sm text-red-500 font-medium animate-pulse">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="text-base font-medium text-gray-900"> Phone number </label>
                      <div className="mt-2.5 relative">
                        <input 
                          type="tel" 
                          name="phone" 
                          id="phone" 
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="e.g., 9876543210"
                          className={`block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 border rounded-md bg-gray-50 focus:outline-none focus:bg-white caret-primary ${
                            touched.phone && errors.phone 
                              ? 'border-red-500 focus:border-red-500' 
                              : 'border-gray-200 focus:border-primary'
                          }`}
                        />
                        {touched.phone && errors.phone && (
                          <p className="mt-1 text-sm text-red-500 font-medium animate-pulse">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="company" className="text-base font-medium text-gray-900"> Company name </label>
                      <div className="mt-2.5 relative">
                        <input 
                          type="text" 
                          name="company" 
                          id="company" 
                          value={formData.company}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your company name"
                          className={`block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 border rounded-md bg-gray-50 focus:outline-none focus:bg-white caret-primary ${
                            touched.company && errors.company 
                              ? 'border-red-500 focus:border-red-500' 
                              : 'border-gray-200 focus:border-primary'
                          }`}
                        />
                        {touched.company && errors.company && (
                          <p className="mt-1 text-sm text-red-500 font-medium animate-pulse">{errors.company}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="message" className="text-base font-medium text-gray-900"> Message </label>
                      <div className="mt-2.5 relative">
                        <textarea
                          name="message"
                          id="message"
                          value={formData.message}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Type your message here (minimum 10 characters)"
                          rows="4"
                          className={`block w-full px-4 py-4 text-black placeholder-gray-500 transition-all duration-200 border rounded-md resize-y bg-gray-50 focus:outline-none focus:bg-white caret-primary ${
                            touched.message && errors.message 
                              ? 'border-red-500 focus:border-red-500' 
                              : 'border-gray-200 focus:border-primary'
                          }`}
                        ></textarea>
                        {touched.message && errors.message && (
                          <p className="mt-1 text-sm text-red-500 font-medium animate-pulse">{errors.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <button 
                        type="submit" 
                        disabled={loading}
                        className={`inline-flex items-center justify-center w-full px-4 py-4 mt-2 text-base font-semibold transition duration-300 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                          loading 
                            ? 'bg-gray-400 cursor-not-allowed text-white' 
                            : 'bg-primary hover:bg-white border border-white hover:border-primary text-white hover:text-primary'
                        }`}
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </span>
                        ) : 'Send Message'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="bg-[url('https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80')] bg-cover bg-center bg-no-repeat lg:col-span-2 relative min-h-[400px] lg:min-h-full">
              <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30'></div>

              <div className="relative h-full p-6 sm:p-10 flex flex-col justify-between">
                <div>
                  <h4 className="text-2xl font-semibold text-white font-heading">Contact Info</h4>

                  <div className="mt-8 space-y-7">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-black/20 text-primary">
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="block ml-4 text-base text-white font-medium"> 123 Main Street, Mumbai, Maharashtra 400001, India </span>
                    </div>

                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-black/20 text-primary">
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="block ml-4 text-base text-white font-medium"> info@example.com </span>
                    </div>

                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-black/20 text-primary">
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <span className="block text-base text-white font-medium"> +91 9876543210 </span>
                        <span className="block mt-1 text-[13px] text-white/70 font-medium"> 022 12345678 </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 lg:mt-auto">
                  <hr className="border-gray-500/50" />
                  <div className="flex items-center justify-between mt-7">
                    <p className="text-lg font-semibold text-white font-heading">Follow us on</p>

                    <ul className="flex items-center justify-end space-x-3">
                      {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                        <li key={social}>
                          <a
                            href="#"
                            className="
                              flex
                              items-center
                              justify-center
                              text-white
                              transition-all
                              duration-200
                              bg-transparent
                              border border-gray-300
                              rounded-full
                              w-8
                              h-8
                              focus:bg-primary
                              hover:text-black
                              focus:text-black
                              hover:bg-primary hover:border-primary
                              focus:border-primary
                            "
                          >
                            <span className="sr-only">{social}</span>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;