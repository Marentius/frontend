'use client';

import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Opprett et egendefinert ikon for blomsten
const createFlowerIcon = () =>
  L.divIcon({
    className: "flower-icon",
    html: `<div class="flower"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

// Oppdatert fylkeKommuneMapping med korrekte fylker
const fylkeKommuneMapping = {
  'Agder': ['42'],
  'Akershus': ['32'],
  'Buskerud': ['31'],
  'Finnmark': ['56'],
  'Innlandet': ['34'],
  'Møre og Romsdal': ['15'],
  'Nordland': ['18'],
  'Oslo': ['03'],
  'Rogaland': ['11'],
  'Telemark': ['40'],
  'Troms': ['55'],
  'Trøndelag': ['50'],
  'Vestfold': ['39'],
  'Vestland': ['46'],
  'Østfold': ['31']
};

// Komponent for å kontrollere kartvisningen
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

const NorwayMap = ({ sales }) => {
  const [norgeData, setNorgeData] = useState(null);
  const [fylkerData, setFylkerData] = useState(null);
  const [kommunerData, setKommunerData] = useState(null);
  const [selectedFylke, setSelectedFylke] = useState('');
  const [selectedKommune, setSelectedKommune] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef();
  const geojsonRef = useRef();

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetch('/data/Norge-S.geojson').then(res => res.json()),
      fetch('/data/Fylker-S.geojson').then(res => res.json()),
      fetch('/data/Kommuner-S.geojson').then(res => res.json()),
    ])
      .then(([norgeJson, fylkerJson, kommunerJson]) => {        
        setNorgeData(norgeJson);
        setFylkerData(fylkerJson);
        setKommunerData(kommunerJson);
        setError(null);
      })
      .catch(error => {
        console.error('Error loading GeoJSON:', error);
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Reset kommune når fylke endres
  useEffect(() => {
    setSelectedKommune('');
  }, [selectedFylke]);

  const norgeStyle = {
    fillColor: '#74c476',
    weight: 2,
    opacity: 1,
    color: '#666',
    fillOpacity: 0.2
  };

  // Oppdatert fylkeStyle for å håndtere aktive og inaktive fylker
  const getFylkeStyle = (feature) => {
    // Vis alle fylker i normal farge når "Norge" er valgt
    if (selectedFylke === 'Norge') {
      return {
        fillColor: '#74c476',
        weight: 2,
        opacity: 1,
        color: '#666',
        fillOpacity: 0.4
      };
    }
    
    const isSelected = feature.properties.name === selectedFylke;
    return {
      fillColor: isSelected ? '#74c476' : '#e5e5e5',
      weight: isSelected ? 2 : 1,
      opacity: 1,
      color: '#666',
      fillOpacity: isSelected ? 0.6 : 0.2
    };
  };

  // Ny style for kommuner
  const getKommuneStyle = (feature) => {
    const isSelectedFylke = fylkeKommuneMapping[selectedFylke]?.includes(
      feature.properties.kommunenummer.substring(0, 2)
    );
    const isSelectedKommune = feature.properties.name === selectedKommune;

    if (isSelectedKommune) {
      return {
        fillColor: '#74c476',
        weight: 2,
        opacity: 1,
        color: '#666',
        fillOpacity: 0.8
      };
    } else if (isSelectedFylke) {
      return {
        fillColor: '#bae4b3',
        weight: 1,
        opacity: 1,
        color: '#666',
        fillOpacity: 0.4
      };
    } else {
      return {
        fillColor: '#e5e5e5',
        weight: 1,
        opacity: 1,
        color: '#666',
        fillOpacity: 0.1
      };
    }
  };

  if (isLoading) return <div>Laster kart...</div>;
  if (error) return <div>Error: {error}</div>;

  const fylker = fylkerData?.features.map(f => f.properties.name) || [];
  
  // Oppdater filtreringen av kommuner
  const kommuner = kommunerData?.features
    .filter(k => {
      const kommunePrefix = k.properties.kommunenummer.substring(0, 2);
      const fylkePrefix = fylkeKommuneMapping[selectedFylke];
      return fylkePrefix && fylkePrefix.includes(kommunePrefix);
    })
    .map(k => k.properties.name) || [];

 
return (
  <div className="map-container">
    <div className="controls">
      {(selectedFylke && selectedFylke !== 'Norge') && (
        <button 
          onClick={() => {
            setSelectedFylke('Norge');
            setSelectedKommune('');
          }}
          className="norge-button"
        >
          ← Hele Norge
        </button>
      )}
      
      <select 
        value={selectedFylke} 
        onChange={(e) => setSelectedFylke(e.target.value)}
        className="fylke-select"
      >
        <option value="">Velg fylke</option>
        {fylker.sort().map(fylke => (
          <option key={fylke} value={fylke}>
            {fylke}
          </option>
        ))}
      </select>

      {selectedFylke && selectedFylke !== 'Norge' && (
        <select 
          value={selectedKommune}
          onChange={(e) => setSelectedKommune(e.target.value)}
          className="kommune-select"
        >
          <option value="">Velg kommune</option>
          {kommuner.sort().map(kommune => (
            <option key={kommune} value={kommune}>
              {kommune}
            </option>
          ))}
        </select>
      )}
    </div>
      
      <MapContainer
        ref={mapRef}
        center={[65, 13]}
        zoom={5}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {!isLoading && !error && norgeData && (
          <GeoJSON
            data={norgeData}
            style={norgeStyle}
          />
        )}

        {!isLoading && !error && fylkerData && (
          <GeoJSON
            ref={geojsonRef}
            data={fylkerData}
            style={getFylkeStyle}
          />
        )}

        {!isLoading && !error && kommunerData && selectedFylke && (
          <GeoJSON
            data={kommunerData}
            style={getKommuneStyle}
          />
        )}

        <MapController 
          selectedFylke={selectedFylke}
          selectedKommune={selectedKommune}
          kommunerData={kommunerData}
          fylkerData={fylkerData}
          norgeData={norgeData}
        />

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
    </div>
  );
};

export default NorwayMap;
