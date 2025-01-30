'use client';

import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import '../styles/map.css';
import '../styles/flower.css';

import { norgeStyle, getFylkeStyle, getKommuneStyle } from '../utils/mapStyles';
import { getStoreLocation } from '../utils/storeLocations';
import { setupWebSocket, closeWebSocket } from '../services/websocketService';
import MapController from './MapController';
import { fylkeKommuneMapping } from '../utils/constants';
import SaleMarker from './SaleMarker';
import { loadStoreData } from '../services/storeService';
import StoreMarkers from './StoreMarkers';

// Opprett et egendefinert ikon for blomsten
const createFlowerIcon = () =>
  L.divIcon({
    className: "flower-marker",
    html: `<div class="flower"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  });

const NorwayMap = () => {
  const [norgeData, setNorgeData] = useState(null);
  const [fylkerData, setFylkerData] = useState(null);
  const [kommunerData, setKommunerData] = useState(null);
  const [selectedFylke, setSelectedFylke] = useState('');
  const [selectedKommune, setSelectedKommune] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSales, setLocalSales] = useState([]);
  const processedSalesRef = useRef(new Set());
  const wsRef = useRef(null);
  const animatingRef = useRef(new Set());
  const mapRef = useRef();
  const geojsonRef = useRef();
  const storeLocationsRef = useRef(new Map());
  const [stores, setStores] = useState(new Map());

  // Load GeoJSON data
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

  // Reset kommune when fylke changes
  useEffect(() => {
    setSelectedKommune('');
  }, [selectedFylke]);

  // Cleanup refs on unmount
  useEffect(() => {
    return () => {
      processedSalesRef.current.clear();
      storeLocationsRef.current.clear();
    };
  }, []);

  // WebSocket setup
  useEffect(() => {
    if (wsRef.current) return;

    wsRef.current = setupWebSocket((newSale) => {
      setLocalSales(prevSales => {
        if (prevSales.some(sale => sale.uniqueReceiptId === newSale.uniqueReceiptId)) {
          return prevSales;
        }
        return [...prevSales, newSale];
      });
    }, processedSalesRef);

    return () => {
      closeWebSocket();
      wsRef.current = null;
    };
  }, []);

  // Load store data
  useEffect(() => {
    loadStoreData().then((storeData) => {
      console.log('Butikkdata lastet');
      setStores(storeData);
    });
  }, []);

  if (isLoading) return <div>Laster kart...</div>;
  if (error) return <div>Error: {error}</div>;

  const fylker = fylkerData?.features.map(f => f.properties.name) || [];
  const kommuner = kommunerData?.features
    .filter(k => {
      const kommunePrefix = k.properties.kommunenummer.substring(0, 2);
      const fylkePrefix = fylkeKommuneMapping[selectedFylke];
      return fylkePrefix && fylkePrefix.includes(kommunePrefix);
    })
    .map(k => k.properties.name) || [];

  console.log('Current localSales:', localSales);

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

        {norgeData && (
          <GeoJSON data={norgeData} style={norgeStyle} />
        )}

        {fylkerData && (
          <GeoJSON
            ref={geojsonRef}
            data={fylkerData}
            style={(feature) => getFylkeStyle(feature, selectedFylke)}
          />
        )}

        {kommunerData && selectedFylke && (
          <GeoJSON
            data={kommunerData}
            style={(feature) => getKommuneStyle(feature, selectedFylke, selectedKommune, fylkeKommuneMapping)}
          />
        )}

        <MapController
          selectedFylke={selectedFylke}
          selectedKommune={selectedKommune}
          kommunerData={kommunerData}
          fylkerData={fylkerData}
          norgeData={norgeData}
        />

        <StoreMarkers stores={stores} />

        {localSales.map((sale) => {
          if (!sale || !sale.storeNo) return null;

          const location = getStoreLocation(sale.storeNo, storeLocationsRef);
          if (isNaN(location.lat) || isNaN(location.lng)) return null;

          return (
            <SaleMarker
              key={sale.uniqueReceiptId}
              sale={sale}
              location={location}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

export default NorwayMap;
