import { useEffect, useState } from 'react';
import { Popup } from 'react-leaflet';
import { getStoreName } from '../services/storeService';
import SaleRipple from './SaleRipple';

const SaleMarker = ({ sale, location }) => {
    const [showRipple, setShowRipple] = useState(true);

    useEffect(() => {
        const rippleTimer = setTimeout(() => {
            setShowRipple(false);
        }, 1500);

        return () => {
            clearTimeout(rippleTimer);
        };
    }, []);

    return showRipple ? (
        <SaleRipple position={[location.lat, location.lng]} />
    ) : null;
};

export default SaleMarker; 