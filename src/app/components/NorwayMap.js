import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Opprett et egendefinert ikon for blomsten
const createFlowerIcon = () =>
  L.divIcon({
    className: "flower-icon", // Bruk en CSS-klasse for stil og animasjon
    html: `<div class="flower"></div>`, // HTML for blomsten
    iconSize: [30, 30], // Størrelse på blomsten
    iconAnchor: [15, 30], // Forankringspunkt
  });

const NorwayMap = ({ sales }) => {
  return (
    <MapContainer
      center={[64.9631, 10.7726]} // Sentrum av Norge
      zoom={5} // Zoomnivå
      style={{ height: "600px", width: "100%" }} // Kartstørrelse
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Bruk egendefinerte blomsterikoner */}
      {sales.map((sale, index) => (
        <Marker key={index} position={[sale.lat, sale.lng]} icon={createFlowerIcon()}>
          <Popup>
            <strong>Salg #{sale.id}</strong>
            <br />
            {sale.amount} NOK
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default NorwayMap;
