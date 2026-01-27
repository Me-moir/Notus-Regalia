"use client";
import { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';
import Navbar from './Navbar';
import HomeTab from './tabs/HomeTab';
import Footer from './Footer';

const ClientWrapper = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Add this
  const [activeCardIndex, setActiveCardIndex] = useState(1);
  const [textAnimationKey, setTextAnimationKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Preload critical sections during loading screen
  useEffect(() => {
    if (isLoading) {
      // Preload Hero and Partners sections
      import('./tabs/HomeTab/sections/HeroSection');
      import('./tabs/HomeTab/sections/ExecutiveSummary');
      
      // Optionally preload fonts or critical assets
      if (typeof document !== 'undefined') {
        document.fonts.ready.then(() => {
          console.log('✅ Fonts loaded');
        });
      }
    }
  }, [isLoading]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Update animation key when card changes
  useEffect(() => {
    setIsAnimating(true);
    setTextAnimationKey((prev) => prev + 1);
    
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [activeCardIndex]);

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <main>
        {activeTab === 'home' && (
          <HomeTab
            activeCardIndex={activeCardIndex}
            setActiveCardIndex={setActiveCardIndex}
            textAnimationKey={textAnimationKey}
            isAnimating={isAnimating}
          />
        )}
        {/* Add other tabs here */}
      </main>
      
      <Footer />
    </div>
  );
};

export default ClientWrapper;