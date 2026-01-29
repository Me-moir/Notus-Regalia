"use client";
import { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';
import Navbar from './Navbar';
import MainContent from './MainContent';
import Footer from './Footer';

const ClientWrapper = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discover'); // ✅ Changed from 'home' to 'discover'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Preload critical sections during loading screen
  useEffect(() => {
    if (isLoading) {
      // Preload Discover tab sections
      import('../tabs/Discover/HeroSection');
      import('../tabs/Discover/Overview');
      
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
        {/* MainContent handles all tab switching and rendering */}
        <MainContent activeTab={activeTab} />
      </main>
      
      <Footer />
    </div>
  );
};

export default ClientWrapper;