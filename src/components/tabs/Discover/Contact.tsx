"use client";
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section 
      id="contact-section"
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, rgb(20, 20, 20) 0%, rgb(10, 10, 10) 50%, rgb(0, 0, 0) 100%)',
        minHeight: '100vh',
        paddingTop: '10vh',
        paddingBottom: '10vh',
        borderTop: '1px dashed rgba(255, 255, 255, 0.2)'
      }}
    >
      {/* Grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '100px 100px',
        }}
      />

      {/* Section Title */}
      <div className="relative z-10 w-full">
        {/* Top dashed border - full width */}
        <div className="w-full h-px border-t border-dashed border-white/30" />
        
        {/* Title without side lines */}
        <div className="text-center py-8">
          <h2 className="text-sm lg:text-base text-gray-300 uppercase tracking-[0.25em] font-bold">
            Reach Out
          </h2>
        </div>
      </div>

      {/* Contact Content */}
      <div className="relative z-10 container mx-auto px-8 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gray-400 text-lg">
              Have a question or want to work together? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="relative">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm text-gray-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:border-white/30 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:border-white/30 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm text-gray-400 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:border-white/30 focus:outline-none transition-colors resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-semibold hover:bg-white/20 transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-white font-semibold mb-4 text-lg">Get in Touch</h3>
                <div className="space-y-4 text-gray-400">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>contact@example.com</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Your Location Here</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4 text-lg">Follow Us</h3>
                <div className="flex gap-4">
                  {/* Social media icons */}
                  <a href="#" className="w-10 h-10 flex items-center justify-center bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300">
                    <span className="text-white text-sm">TW</span>
                  </a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300">
                    <span className="text-white text-sm">LI</span>
                  </a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300">
                    <span className="text-white text-sm">GH</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;