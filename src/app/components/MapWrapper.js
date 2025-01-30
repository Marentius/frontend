'use client';

import dynamic from 'next/dynamic';

const NorwayMap = dynamic(() => import('./NorwayMap'), {
  ssr: false, // Deaktiver server-side rendering
  loading: () => <div>Laster kart...</div>
});

const MapWrapper = () => {
  return <NorwayMap />;
};

export default MapWrapper; 