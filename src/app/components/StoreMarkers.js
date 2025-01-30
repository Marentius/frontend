import { useEffect, useState } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

const storeIcon = L.icon({
    iconUrl: '/Marker.png',
    iconSize: [24, 24],     // størrelse på ikonet
    iconAnchor: [12, 24],   // punktet på ikonet som skal peke på lokasjonen (midt-bunn)
    pane: 'markerPane'
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