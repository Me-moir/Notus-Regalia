"use client";
import { memo } from 'react';
import Overview from './OverviewGrids';
import DiscoverHeader from './DiscoverHeader';
import WorldPanel from './AboutPanel';
import Teams from './Teams';
import Affiliations from './Affiliations';

const Discover = () => {
  return (
    <div style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {/* Discover Header */}
      <DiscoverHeader />

      {/* Overview Section */}
      <div id="section-overview">
        <Overview />
      </div>

      {/* World panel: company / direction / governance / reachout */}
      <div id="section-world">
        <WorldPanel />
      </div>

      {/* Teams */}
      <div id="section-teams">
        <Teams />
      </div>

      {/* Affiliations */}
      <div id="section-affiliations">
        <Affiliations />
      </div>
    </div>
  );
};

export default Discover;