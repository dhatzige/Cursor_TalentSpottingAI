'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    message: '',
    purpose: 'general', // general, demo, enterprise
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Get URL parameters
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('enterprise') === 'true') {
        setFormData(prev => ({ ...prev, purpose: 'enterprise' }));
      } else if (params.get('demo') === 'true') {
        setFormData(prev => ({ ...prev, purpose: 'demo' }));
      }
    }
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real application, this would be an API call to your backend
      console.log('Form submitted:', formData);
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      <Navbar transparent={false} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {submitted ? (
            <div className="bg-[#131b39]/70 rounded-lg p-8 text-center border border-green-500 shadow-lg shadow-green-500/10">
              <div className="text-green-400 text-5xl mb-4">✓</div>
              <h2 className="text-2xl font-bold mb-4">Thank You for Contacting Us!</h2>
              <p className="text-gray-300 mb-6">
                We've received your message and will get back to you within 24 hours. A confirmation has been sent to your email.
              </p>
              <div className="flex justify-center">
                <Link 
                  href="/" 
                  className="px-6 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
                {formData.purpose === 'enterprise' 
                  ? 'Enterprise Sales Inquiry' 
                  : formData.purpose === 'demo' 
                    ? 'Request a Demo' 
                    : 'Contact Us'
                }
              </h1>
              <p className="text-gray-300 mb-8 text-center">
                {formData.purpose === 'enterprise' 
                  ? 'Learn more about our enterprise solutions tailored to your organization\'s needs.' 
                  : formData.purpose === 'demo' 
                    ? 'See TalentSpottingAI in action with a personalized demonstration.' 
                    : 'Have questions? We\'re here to help. Fill out the form below and we\'ll get back to you.'
                }
              </p>
              
              <div className="bg-[#131b39]/70 rounded-lg p-6 md:p-8 border border-gray-800">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-300 mb-2">Your Name*</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required
                        className="w-full px-4 py-2 bg-[#0a0f1a] border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Work Email*</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required
                        className="w-full px-4 py-2 bg-[#0a0f1a] border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Company/Organization*</label>
                      <input 
                        type="text" 
                        name="company" 
                        value={formData.company} 
                        onChange={handleChange} 
                        required
                        className="w-full px-4 py-2 bg-[#0a0f1a] border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Your Role*</label>
                      <select 
                        name="role" 
                        value={formData.role} 
                        onChange={handleChange} 
                        required
                        className="w-full px-4 py-2 bg-[#0a0f1a] border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select your role</option>
                        <option value="recruiter">Recruiter/Talent Acquisition</option>
                        <option value="hr">HR Manager</option>
                        <option value="exec">Executive/Leadership</option>
                        <option value="university">University Administrator</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-300 mb-2">What can we help you with?*</label>
                    <select 
                      name="purpose" 
                      value={formData.purpose} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2 bg-[#0a0f1a] border border-gray-700 rounded-md focus:outline-none focus:border-blue-500 mb-6"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="demo">Request a Demo</option>
                      <option value="enterprise">Enterprise Solutions</option>
                    </select>
                    
                    <textarea 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      required
                      placeholder="Please provide details about your needs or questions..."
                      rows={5}
                      className="w-full px-4 py-2 bg-[#0a0f1a] border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="text-center">
                    <button 
                      type="submit"
                      disabled={submitting}
                      className="px-8 py-3 bg-blue-600 rounded-md text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Sending...' : 'Submit'}
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Need immediate assistance? Call us at <span className="text-blue-400">(555) 123-4567</span> or email <a href="mailto:sales@talentspottingai.com" className="text-blue-400 hover:underline">sales@talentspottingai.com</a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
