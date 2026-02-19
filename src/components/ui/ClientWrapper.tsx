"use client";
import { useState, useEffect, useCallback } from 'react';
import Navbar from './Navbar';
import MainContent from './MainContent';
import Footer from './Footer';

type TabType = 'home' | 'discover' | 'information' | 'affiliations' | 'ventures';

const VALID_TABS: TabType[] = ['home', 'discover', 'information', 'affiliations', 'ventures'];

const ClientWrapper = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const isValidTab = useCallback((tab: string): tab is TabType => {
    return VALID_TABS.includes(tab as TabType);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabFromUrl = params.get('tab');
    if (tabFromUrl && isValidTab(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [isValidTab]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.infoTab) return;
      const tab = event.state?.tab;
      if (tab && isValidTab(tab)) {
        setActiveTab(tab);
      } else {
        setActiveTab('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isValidTab]);

  const handleTabChange = useCallback((tab: TabType) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    const url = new URL(window.location.href);
    if (tab === 'home') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', tab);
    }
    window.history.pushState({ tab }, '', url);
  }, [activeTab]);

  return (
    <div className="min-h-screen theme-transition" style={{ background: 'var(--surface-primary)', color: 'var(--content-primary)' }}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange}
      />
      
      <main>
        <MainContent activeTab={activeTab} />
      </main>
      
      <Footer />
    </div>
  );
};

export default ClientWrapper;