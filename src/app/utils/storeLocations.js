import { getStoreLocation as getStoreFromData } from '../services/storeService';

const fallbackLocations = {
    '100-299': { lat: 59.9139, lng: 10.7522 }, // Oslo-området
    '300-499': { lat: 60.3913, lng: 5.3221 },  // Bergen-området
    '500-699': { lat: 63.4305, lng: 10.3951 }, // Trondheim-området
    '700-899': { lat: 69.6492, lng: 18.9553 }, // Tromsø-området
    '900-999': { lat: 58.9700, lng: 5.7331 },  // Stavanger-området
    'default': { lat: 65.0000, lng: 13.0000 }  // Midt i Norge
};

export const getStoreLocation = (storeNo, storeLocationsRef) => {
    // Først sjekk om vi har cached lokasjonen
    if (storeLocationsRef.current.has(storeNo)) {
        return storeLocationsRef.current.get(storeNo);
    }

    // Prøv å hente fra CSV-dataene
    const csvLocation = getStoreFromData(storeNo);
    if (csvLocation) {
        storeLocationsRef.current.set(storeNo, csvLocation);
        return csvLocation;
    }

    // Fallback til omtrentlig plassering
    const storeNumber = parseInt(storeNo);
    const range = Object.keys(fallbackLocations).find(range => {
        const [min, max] = range.split('-').map(Number);
        return storeNumber >= min && storeNumber <= max;
    }) || 'default';

    const base = fallbackLocations[range];
    const location = {
        lat: base.lat + (Math.random() - 0.5) * 0.01,
        lng: base.lng + (Math.random() - 0.5) * 0.01
    };

    storeLocationsRef.current.set(storeNo, location);
    return location;
}; 