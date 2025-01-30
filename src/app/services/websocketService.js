let globalWs = null;

export const setupWebSocket = (onNewSale, processedSalesRef) => {
    if (globalWs) {
        console.log('WebSocket allerede opprettet');
        return globalWs;
    }

    const wsUrl = 'ws://localhost:8080';
    console.log('Oppretter WebSocket-tilkobling');

    globalWs = new WebSocket(wsUrl);

    globalWs.onmessage = (event) => {
        try {
            if (event.data.startsWith('Welcome')) return;

            const saleData = JSON.parse(event.data);

            // Sjekk bare om vi har prosessert dette spesifikke salget før
            if (!processedSalesRef.current.has(saleData.uniqueReceiptId)) {
                processedSalesRef.current.add(saleData.uniqueReceiptId);
                onNewSale(saleData);
            }
        } catch (error) {
            console.error('Feil ved håndtering av WebSocket melding:', error);
        }
    };

    return globalWs;
};

export const closeWebSocket = () => {
    if (globalWs) {
        globalWs.close();
        globalWs = null;
    }
}; 