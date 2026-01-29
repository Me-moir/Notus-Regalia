"use client";

const AffiliatesTab = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-[#141414] flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Icon or Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-red-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Affiliations
        </h1>

        {/* Description */}
        <p className="text-xl md:text-2xl text-gray-400 mb-8">
          Our partners, sponsors, and collaborative network
        </p>

        {/* Coming Soon Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-300 font-medium">Coming Soon</span>
        </div>

        {/* Additional Info */}
        <p className="mt-12 text-sm text-gray-500 max-w-2xl mx-auto">
          We're preparing to showcase our growing network of partners and affiliates. Stay tuned for updates.
        </p>
      </div>
    </section>
  );
};

export default AffiliatesTab;