"use client";
import { memo } from 'react';

const JourneyStepsSection = memo(() => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12 py-24">
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16 text-white">
          The Three Stages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-green-500/50 transition-all">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white">Begin</h3>
            <p className="text-gray-400 text-sm sm:text-base">Start with curiosity and courage. The first step is always the hardest, but also the most important.</p>
          </div>
          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-green-500/50 transition-all">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white">Transform</h3>
            <p className="text-gray-400 text-sm sm:text-base">Through trials and experiences, transform yourself. Growth happens outside your comfort zone.</p>
          </div>
          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-green-500/50 transition-all">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white">Transcend</h3>
            <p className="text-gray-400 text-sm sm:text-base">Reach heights you never imagined. The fool who persists becomes the master.</p>
          </div>
        </div>
      </div>
    </section>
  );
});

JourneyStepsSection.displayName = 'JourneyStepsSection';

export default JourneyStepsSection;