'use client';

import { useState, useEffect } from "react";
import NorwayMap from "./components/NorwayMap";

export default function Home() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onmessage = (event) => {
      if (event.data === "Welcome to the simulated backend!") {
        console.log("Velkomstmelding mottatt, ingen parsing nødvendig.");
        return;
      }
    
      try {
        const message = JSON.parse(event.data);
    
        if (message.event === "sale") {
          // Bruk koordinatene fra backend
          const { latitude, longitude } = message.data;
    
          setSales((prevSales) => [
            ...prevSales,
            { id: message.data.id, amount: message.data.amount, lat: latitude, lng: longitude },
          ]);
        }
      } catch (err) {
        console.error("Ugyldig melding fra serveren:", event.data);
      }
    };
    
    
    

    return () => socket.close();
  }, []);

  return (
    <div>
      <h1>Salgskart for Norge</h1>
      <NorwayMap sales={sales} />
    </div>
  );
}

