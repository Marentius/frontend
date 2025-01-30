export const norgeStyle = {
    fillColor: '#74c476',
    weight: 2,
    opacity: 1,
    color: '#666',
    fillOpacity: 0.2
};

export const getFylkeStyle = (feature, selectedFylke) => {
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

export const getKommuneStyle = (feature, selectedFylke, selectedKommune, fylkeKommuneMapping) => {
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