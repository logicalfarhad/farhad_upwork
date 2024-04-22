import React, { useState } from 'react';
import LeafletMap from './LeafletMap';
import { Container, Typography, Button, Card, CardContent, TextareaAutosize, MenuItem, Select, FormControl, InputLabel, CircularProgress } from '@material-ui/core';
import { UnControlled as CodeMirror } from 'react-codemirror2'

let defaultSparqlQuery = `PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>

SELECT ?lat ?long
WHERE {
  ?place geo:lat ?lat .
  ?place geo:long ?long .
} LIMIT 10`;

const API_ENDPOINT = process.env.REACT_APP_BACKEND_ENDPOINT_URL
const SPARQL_ENDPOINT = process.env.REACT_APP_SPARQL_ENDPOINT_URL

const SparqlEndpoint = () => {

    const [coordinates, setCoordinates] = useState([]);
    const [sparqlQuery, setSparqlQuery] = useState(defaultSparqlQuery);
    const [selectedUrl, setSelectedUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const getAddress = async (latitude, longitude) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=geojson&lat=${latitude}&lon=${longitude}`);
            if (!response.ok) {
                throw new Error('Failed to fetch address');
            }
            const data = await response.json();
            const address = data.features[0].properties.display_name;
            return address;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    };

    const handleButtonClick = async () => {
        try {
            coordinates.length = 0
            setLoading(true); // Start loading
            const response = await fetch(`${API_ENDPOINT}/api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sparqlQuery: sparqlQuery,
                    fusekiUrl: selectedUrl
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch coordinates');
            }
            const data = await response.json();
            const coords = [];
            const uniqueCoords = new Set(); // Use a Set to store unique coordinates
            for (const loc of data.results.bindings) {
                const lat = parseFloat(loc.lat.value);
                const long = parseFloat(loc.long.value);
                const address = await getAddress(lat, long);
                // Generate a unique key combining latitude and longitude
                const key = `${lat}-${long}`;
                // Check if the key is already in the set
                if (!uniqueCoords.has(key)) {
                    // If not, add the coordinates to the set
                    uniqueCoords.add(key);
                    // Push the coordinates and address to the coords array
                    coords.push({ cor: [lat, long], add: address });
                }
            }
            setCoordinates(coords);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <Container style={{ marginTop: '40px' }}>
            <Typography variant="h6">SPARQL Query Endpoint for Geo Model</Typography>
            <Card>
                <CardContent>
                    <FormControl fullWidth style={{ marginBottom: '10px' }}>
                        <InputLabel id="url-select-label">Select URL</InputLabel>
                        <Select
                            labelId="url-select-label"
                            id="url-select"
                            value={selectedUrl}
                            onChange={(e) => setSelectedUrl(e.target.value)}
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value={SPARQL_ENDPOINT}>{SPARQL_ENDPOINT}</MenuItem>
                        </Select>
                    </FormControl>
                    <TextareaAutosize
                        aria-label="Sparql Query"
                        placeholder="Enter your SPARQL query here"
                        minRows={5}
                        value={sparqlQuery}
                        onChange={(e) => setSparqlQuery(e.target.value)}
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!selectedUrl || loading}
                        onClick={handleButtonClick}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Submit'}
                    </Button>
                </CardContent>
            </Card>
            {coordinates.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <Typography variant="h6">Location Map</Typography>
                    <Card style={{ marginTop: '20px' }}>
                        <CardContent>
                            <LeafletMap coordinates={coordinates} />
                        </CardContent>
                    </Card>
                </div>
            )}
        </Container>
    );
};

export default SparqlEndpoint;
