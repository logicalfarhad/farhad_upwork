import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Card, CardContent, TextareaAutosize, MenuItem, Select, FormControl, InputLabel, CircularProgress } from '@material-ui/core';
import ResponseTable from './ResponseTable';
import LeafletMap from './LeafletMap';
import PredicateDialog from './PredicateDialog'; // Import the PredicateDialog component
//import { fetchAddress } from './utils'; // Import any utility function you need

const defaultSparqlQuery = `PREFIX geo:<http://www.w3.org/2003/01/geo/wgs84_pos#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>
PREFIX geom:<http://www.semanticweb.org/hn/geom#>
SELECT ?subject ?predicate ?object
 WHERE { ?subject ?predicate ?object .
 FILTER (?subject = geom:Lower_Station_Street) }`;

const API_ENDPOINT = process.env.REACT_APP_BACKEND_ENDPOINT_URL;
const SPARQL_ENDPOINT = process.env.REACT_APP_SPARQL_ENDPOINT_URL;
const GEOM_PREFIX = 'geom:';

const SparqlEndpoint = () => {
    const [sparqlQuery, setSparqlQuery] = useState(defaultSparqlQuery);
    const [selectedUrl, setSelectedUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [coordinates, setCoordinates] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState([]);
    const [selectedPredicate, setSelectedPredicate] = useState('');
    useEffect(() => {
        if (!API_ENDPOINT || !SPARQL_ENDPOINT) {
            console.error("Backend or SPARQL endpoint not defined.");
            return;
        }
    }, []);

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

    const extractGeomName = (query) => {
        const lines = query.split('\n'); // Split the query into lines
        let geomName;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().startsWith('FILTER')) {
                const filterLine = lines[i].trim();
                const geomIndex = filterLine.indexOf('geom:') + 5; // Adding 5 to skip 'geom:'
                const endOfGeomName = filterLine.indexOf(')', geomIndex); // Find the end of geom name
                if (geomIndex !== -1 && endOfGeomName !== -1) {
                    geomName = filterLine.substring(geomIndex, endOfGeomName).trim(); // Extract geom name
                    break;
                }
            }
        }
        return geomName;
    }

    // Inside handlePredicateClick
    const handlePredicateClick = async (predicate) => {
        try {
            setLoading(true);
            const predicateName = predicate.split('#')[1];
            const selectSub = extractGeomName(defaultSparqlQuery);
            setSelectedPredicate(selectSub);
            const newSparqlQuery = defaultSparqlQuery.replace(selectSub, predicateName);
            console.log(newSparqlQuery)
            const response = await fetch(`${API_ENDPOINT}/api`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sparqlQuery: newSparqlQuery, fusekiUrl: selectedUrl }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch coordinates');
            }

            const newResponseData = await response.json();
            // Set dialogContent to the actual predicate details
            setDialogContent(newResponseData.results.bindings);
            setSelectedPredicate(`${GEOM_PREFIX}${predicateName}`);
            setDialogOpen(true);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };


   const handleObjectClick = async (object) => {
    console.log('Object clicked:', object);

    try {
        setLoading(true);

        const predicateName = object.split('#')[1];
        const selectSub = extractGeomName(defaultSparqlQuery);
        console.log(predicateName);
        console.log(selectSub);

        const newSparqlQuery = defaultSparqlQuery.replace(selectSub, predicateName);
        setSparqlQuery(newSparqlQuery);
        console.log('Updated SPARQL query:', newSparqlQuery);

        const response = await fetch(`${API_ENDPOINT}/api`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sparqlQuery: newSparqlQuery, fusekiUrl: selectedUrl }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch coordinates');
        }

        const responseData = await response.json();
        setResponse(responseData);

        const coords = [];
        const uniqueCoords = new Set();
        let latitude = null;
        let longitude = null;
        let address = null;

        for (const loc of responseData.results.bindings) {
            if (loc.predicate.value === 'http://www.w3.org/2003/01/geo/wgs84_pos#lat' &&
                loc.object.datatype === 'http://www.w3.org/2001/XMLSchema#decimal') {
                latitude = parseFloat(loc.object.value);
            } else if (loc.predicate.value === 'http://www.w3.org/2003/01/geo/wgs84_pos#long' &&
                loc.object.datatype === 'http://www.w3.org/2001/XMLSchema#decimal') {
                longitude = parseFloat(loc.object.value);
            }

            if (latitude !== null && longitude !== null) {
                address = await getAddress(latitude, longitude);
                const key = `${latitude}-${longitude}`;
                if (!uniqueCoords.has(key)) {
                    uniqueCoords.add(key);
                    coords.push({ cor: [latitude, longitude], add: address });
                }
                latitude = null;
                longitude = null;
            }
        }
        setCoordinates(coords);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        setLoading(false);
    }
};


    const handleButtonClick = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_ENDPOINT}/api`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sparqlQuery, fusekiUrl: selectedUrl }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch coordinates');
            }

            const responseData = await response.json();
            setResponse(responseData);

            const coords = [];
            const uniqueCoords = new Set();
            let latitude = null;
            let longitude = null;
            let address = null;

            for (const loc of responseData.results.bindings) {
                if (loc.predicate.value === 'http://www.w3.org/2003/01/geo/wgs84_pos#lat' &&
                    loc.object.datatype === 'http://www.w3.org/2001/XMLSchema#decimal') {
                    latitude = parseFloat(loc.object.value);
                } else if (loc.predicate.value === 'http://www.w3.org/2003/01/geo/wgs84_pos#long' &&
                    loc.object.datatype === 'http://www.w3.org/2001/XMLSchema#decimal') {
                    longitude = parseFloat(loc.object.value);
                }

                if (latitude !== null && longitude !== null) {
                    address = await getAddress(latitude, longitude);
                    const key = `${latitude}-${longitude}`;
                    if (!uniqueCoords.has(key)) {
                        uniqueCoords.add(key);
                        coords.push({ cor: [latitude, longitude], add: address });
                    }
                    latitude = null;
                    longitude = null;
                }
            }
            setCoordinates(coords);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
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

            {response && response.results.bindings.length > 0 && (
                <Card style={{ marginTop: '20px' }}>
                    <CardContent>
                        <Typography variant="h6">Response Table</Typography>
                        <ResponseTable
                            response={response}
                            onPredicateClick={handlePredicateClick}
                            onObjectClick={handleObjectClick}
                        />
                    </CardContent>
                </Card>
            )}

            {coordinates.length > 0 && (
                <Card style={{ marginTop: '20px' }}>
                    <CardContent>
                        <Typography variant="h6">Location Map</Typography>
                        <LeafletMap coordinates={coordinates} />
                    </CardContent>
                </Card>
            )}

            {dialogContent.length > 0 && (
                <PredicateDialog
                    open={dialogOpen}
                    handleClose={() => setDialogOpen(false)}
                    response={dialogContent} // Pass dialogContent as response prop
                />
            )}
        </Container>
    );
};

export default SparqlEndpoint;
