const API_ENDPOINT = process.env.REACT_APP_BACKEND_ENDPOINT_URL;

export const fetchDatasets = async () => {
    try {
        const response = await fetch(`${API_ENDPOINT}/datasets`);
        if (!response.ok) throw new Error('Failed to fetch datasets');
        return await response.json();
    } catch (error) {
        console.error('Error fetching datasets:', error);
        return [];
    }
};

export const fetchSparqlResponse = async (sparqlQuery, selectedUrl, setLoading) => {
    try {
        setLoading(true);
        const response = await fetch(`${API_ENDPOINT}/api`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sparqlQuery, fusekiUrl: selectedUrl }),
        });
        if (!response.ok) throw new Error('Failed to fetch SPARQL response');
        return await response.json();
    } catch (error) {
        console.error('Error fetching SPARQL response:', error);
        return null;
    } finally {
        setLoading(false);
    }
};

export const getAddress = async (latitude, longitude) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=geojson&lat=${latitude}&lon=${longitude}`);
        if (!response.ok) throw new Error('Failed to fetch address');
        const data = await response.json();
        return data.features[0].properties.display_name;
    } catch (error) {
        console.error('Error fetching address:', error);
        return null;
    }
};

export const getCells = async (latitude, longitude) => {
    try {
        const response = await fetch(`${API_ENDPOINT}/s2cells?lat=${latitude}&lng=${longitude}&level=9`);
        if (!response.ok) throw new Error('Failed to fetch CellIds');
        return await response.json();
    } catch (error) {
        console.error('Error fetching CellIds:', error);
        return [];
    }
};
