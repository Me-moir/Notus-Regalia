"use client";
import { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';
import Navbar from './Navbar';
import MainContent from './MainContent';
import Footer from './Footer';

type TabType = 'discover' | 'information' | 'affiliations' | 'ventures';

const ClientWrapper = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('discover');
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

  // ═══════════════════════════════════════════════════════════════════
  // BROWSER HISTORY INTEGRATION
  // ═══════════════════════════════════════════════════════════════════
  
  // Initialize tab from URL on mount (after loading screen)
  useEffect(() => {
    if (!isLoading) {
      const params = new URLSearchParams(window.location.search);
      const tabFromUrl = params.get('tab') as TabType;
      
      if (tabFromUrl && ['discover', 'information', 'affiliations', 'ventures'].includes(tabFromUrl)) {
        setActiveTab(tabFromUrl);
      }
    }
  }, [isLoading]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // If the state has an infoTab property, it's from the Information component
      // Let the Information component handle it, don't interfere
      if (event.state?.infoTab) {
        return;
      }

      // Otherwise, handle main tab navigation
      const tab = event.state?.tab as TabType;
      if (tab && ['discover', 'information', 'affiliations', 'ventures'].includes(tab)) {
        setActiveTab(tab);
      } else {
        setActiveTab('discover');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle tab change with history push
  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;

    setActiveTab(tab);
    
    // Update URL and push to browser history
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({ tab }, '', url);
  };

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
        setActiveTab={handleTabChange}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <main>
        <MainContent activeTab={activeTab} />
      </main>
      
      <Footer />
    </div>
  );
};

export default ClientWrapper;