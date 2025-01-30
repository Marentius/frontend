import { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getStoreName } from '../services/storeService';

const createFlowerIcon = () =>
    L.divIcon({
        className: "flower-marker",
        html: `<div class="flower"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });

const SaleMarker = ({ sale, location }) => {
    const [isVisible, setIsVisible] = useState(true);
    const storeName = getStoreName(sale.storeNo);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <Marker
            position={[location.lat, location.lng]}
            icon={createFlowerIcon()}
        >
            <Popup>
                <strong>{storeName || `Butikk #${sale.storeNo}`}</strong>
                <br />
                Beløp: {parseFloat(sale.receiptTotalIncVat).toFixed(2)} NOK
                <br />
                Antall varer: {sale.quantityOfItems}
            </Popup>
        </Marker>
    );
};

export default SaleMarker; 