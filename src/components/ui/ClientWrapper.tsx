"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import LoadingScreen from './LoadingScreen';
import Navbar from './Navbar';
import MainContent from './MainContent';
import Footer from './Footer';

type TabType = 'discover' | 'information' | 'affiliations' | 'ventures';

const VALID_TABS: TabType[] = ['discover', 'information', 'affiliations', 'ventures'];

const ClientWrapper = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Memoize tab validation to avoid recreating the function
  const isValidTab = useCallback((tab: string): tab is TabType => {
    return VALID_TABS.includes(tab as TabType);
  }, []);

  // Preload critical sections during loading screen
  useEffect(() => {
    if (isLoading) {
      // Use Promise.all for parallel loading
      Promise.all([
        import('../tabs/Discover/HeroSection'),
        import('../tabs/Discover/Overview'),
      ]).then(() => {
        console.log('✅ Critical sections preloaded');
      });
      
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
      const tabFromUrl = params.get('tab');
      
      if (tabFromUrl && isValidTab(tabFromUrl)) {
        setActiveTab(tabFromUrl);
      }
    }
  }, [isLoading, isValidTab]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // If the state has an infoTab property, it's from the Information component
      // Let the Information component handle it, don't interfere
      if (event.state?.infoTab) {
        return;
      }

      // Otherwise, handle main tab navigation
      const tab = event.state?.tab;
      if (tab && isValidTab(tab)) {
        setActiveTab(tab);
      } else {
        setActiveTab('discover');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isValidTab]);

  // Memoize handleTabChange to prevent unnecessary re-renders in child components
  const handleTabChange = useCallback((tab: TabType) => {
    if (tab === activeTab) return;

    setActiveTab(tab);
    
    // Update URL and push to browser history
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({ tab }, '', url);
  }, [activeTab]);

  // Memoize handleLoadingComplete
  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Memoize setSidebarOpen to prevent unnecessary re-renders
  const handleSetSidebarOpen = useCallback((open: boolean | ((prev: boolean) => boolean)) => {
    setSidebarOpen(open);
  }, []);

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={handleSetSidebarOpen}
      />
      
      <main>
        <MainContent activeTab={activeTab} />
      </main>
      
      <Footer />
    </div>
  );
};

export default ClientWrapper;