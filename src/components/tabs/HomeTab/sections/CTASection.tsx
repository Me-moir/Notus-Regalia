"use client";
import { memo } from 'react';

const CTASection = memo(() => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center px-6 sm:px-8 lg:px-12 py-24">
      <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
          Ready to Begin Your Journey?
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          Join us in building the future. Together, we can become anything.
        </p>
        <button className="bg-green-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105 hover:bg-green-500">
          Start Now
        </button>
      </div>
    </section>
  );
});

CTASection.displayName = 'CTASection';

export default CTASection;