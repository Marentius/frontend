import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const MapController = ({ selectedFylke, selectedKommune, kommunerData, fylkerData, norgeData }) => {
    const map = useMap();

    useEffect(() => {
        if (selectedKommune && kommunerData) {
            const kommune = kommunerData.features.find(
                f => f.properties.name === selectedKommune
            );
            if (kommune) {
                const bounds = L.geoJSON(kommune).getBounds();
                map.fitBounds(bounds);
            }
        } else if (selectedFylke && selectedFylke !== 'Norge' && fylkerData) {
            const fylke = fylkerData.features.find(
                f => f.properties.name === selectedFylke
            );
            if (fylke) {
                const bounds = L.geoJSON(fylke).getBounds();
                map.fitBounds(bounds);
            }
        } else if (selectedFylke === 'Norge' && norgeData) {
            const bounds = L.geoJSON(norgeData).getBounds();
            map.fitBounds(bounds);
        }
    }, [selectedFylke, selectedKommune, kommunerData, fylkerData, norgeData, map]);

    return null;
};

export default MapController; 