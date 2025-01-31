import { useEffect, useState } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

const storeIcon = L.divIcon({
    className: 'store-dot-icon',
    html: `
        <svg width="14" height="24" viewBox="0 0 24 24">
            <circle 
                cx="12" 
                cy="12" 
                r="6" 
                fill="red" 
                stroke="white" 
                stroke-width="2"
            />
        </svg>
    `,
    iconSize: [12, 12],
    iconAnchor: [12, 12],  // Sentrer ankerpunktet
    className: 'store-dot-icon'
});

const StoreMarkers = ({ stores }) => {
    console.log('Rendrer StoreMarkers med', stores.size, 'butikker');

    return (
        <>
            {Array.from(stores.values())
                .filter(store => {
                    const isValid = store?.location?.lat
                        && store?.location?.lng
                        && !isNaN(store.location.lat)
                        && !isNaN(store.location.lng);

                    if (!isValid) {
                        console.warn('Ugyldig butikklokasjon:', store);
                    }
                    return isValid;
                })
                .map((store) => {
                    console.log('Plasserer markør for', store.name, 'på', store.location);
                    return (
                        <Marker
                            key={store.storeNo}
                            position={[store.location.lat, store.location.lng]}
                            icon={storeIcon}
                            zIndexOffset={1000}
                        />
                    );
                })}
        </>
    );
};

export default StoreMarkers; 