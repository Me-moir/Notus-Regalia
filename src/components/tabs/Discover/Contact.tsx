"use client";
import { useEffect, useState } from 'react';
import { EmailFormEffect } from "@/components/ui/EmailFormEffect";

const Contact = () => {
  const [isMounted, setIsMounted] = useState(false);

  const placeholders = [
    "Valid Email Address",
    "The Best Way to Reach You",
    "Company or Personal email, either works",
    "Join Our Initiative!",
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Email changed:', e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log('Email submitted:', e);
  };

  return (
    <section 
      id="contact-section"
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, rgb(20, 20, 20) 0%, rgb(10, 10, 10) 50%, rgb(0, 0, 0) 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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

      {/* Contact Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8 text-center">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-b from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
          Get in Touch
        </h2>
        
        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-10 sm:mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed">
          Have a question or want to work together? Drop us your email and we'll get back to you.
        </p>

        {/* Email Form */}
        {isMounted && (
          <div className="w-full max-w-2xl mx-auto pointer-events-auto relative z-30">
            <EmailFormEffect
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;