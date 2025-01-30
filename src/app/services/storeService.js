let storeData = null;

export const loadStoreData = async () => {
    if (storeData) return storeData;

    try {
        const response = await fetch('/data/europris.csv');
        const text = await response.text();

        // Debug CSV-innholdet
        console.log('CSV første linje:', text.split('\n')[0]);
        console.log('CSV andre linje:', text.split('\n')[1]);

        const rows = text.split('\n').slice(1);
        console.log('Antall rader i CSV:', rows.length);

        const stores = new Map();

        rows.forEach((row, index) => {
            if (!row.trim()) {
                console.log('Tom rad funnet på indeks:', index);
                return;
            }

            const parts = row.split(',').map(item => item?.trim());
            console.log('Rad', index, 'delt opp:', parts);

            const [storeNo, name, longitude, latitude, region] = parts;

            // Debug koordinater
            console.log('Koordinater for butikk', storeNo, ':', {
                rawLong: longitude,
                rawLat: latitude,
                parsedLong: parseFloat(longitude),
                parsedLat: parseFloat(latitude)
            });

            const parsedLat = parseFloat(latitude);
            const parsedLng = parseFloat(longitude);

            if (storeNo &&
                !isNaN(parsedLat) &&
                !isNaN(parsedLng) &&
                parsedLat !== 0 &&
                parsedLng !== 0) {

                stores.set(storeNo, {
                    storeNo,
                    name: name || `Butikk #${storeNo}`,
                    location: {
                        lat: parsedLat,
                        lng: parsedLng
                    },
                    region: region || 'Ukjent'
                });
                console.log('La til butikk:', storeNo, 'på posisjon:', parsedLat, parsedLng);
            } else {
                console.warn('Ugyldig butikkdata:', { storeNo, name, latitude, longitude, region });
            }
        });

        storeData = stores;
        console.log('Totalt antall lagrede butikker:', stores.size);
        console.log('Første butikk i Map:', stores.values().next().value);
        return stores;
    } catch (error) {
        console.error('Feil ved lasting av butikkdata:', error);
        console.error('Stack trace:', error.stack);
        return new Map();
    }
};

export const getStoreLocation = (storeNo) => {
    if (!storeData) return null;
    const store = storeData.get(storeNo);
    if (!store?.location?.lat || !store?.location?.lng) return null;
    return store.location;
};

export const getStoreName = (storeNo) => {
    if (!storeData) return null;
    const store = storeData.get(storeNo);
    return store?.name || `Butikk #${storeNo}`;
}; 