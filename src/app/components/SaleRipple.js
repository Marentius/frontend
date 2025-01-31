import { useEffect, useState } from 'react';
import { CircleMarker } from 'react-leaflet';

const SaleRipple = ({ position }) => {
    const [radius, setRadius] = useState(5);
    const [opacity, setOpacity] = useState(0.8);

    useEffect(() => {
        const duration = 1500;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            if (progress < 1) {
                setRadius(5 + (45 * progress));  // Voks fra 5 til 50 pixels
                setOpacity(0.8 * (1 - progress));  // Fade ut fra 0.8 til 0
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, []);

    return (
        <CircleMarker
            center={position}
            radius={radius}
            pathOptions={{
                color: '#1e90ff',      // Dodger Blue
                fillColor: '#1e90ff',
                fillOpacity: opacity,
                weight: 2,
                opacity: opacity
            }}
        />
    );
};

export default SaleRipple; 