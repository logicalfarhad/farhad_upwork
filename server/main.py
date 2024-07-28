from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from SPARQLWrapper import SPARQLWrapper, DIGEST, JSON
import uvicorn
from s2sphere import CellId, LatLng, Cell
import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Create a Pydantic model to represent the request body for SPARQL queries
class QueryRequest(BaseModel):
    sparqlQuery: str
    fusekiUrl: str

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Allow the specified methods
    allow_headers=["*"],  # Allow all headers
)

# Helper function to get Fuseki credentials and URL
def get_fuseki_details():
    fuseki_url = os.getenv("FUSEKI_URL")
    fuseki_username = os.getenv("FUSEKI_USERNAME")
    fuseki_password = os.getenv("FUSEKI_PASSWORD")

    if not fuseki_url:
        raise HTTPException(status_code=500, detail="FUSEKI_URL not set in environment variables")
    
    return fuseki_url, fuseki_username, fuseki_password

# Define the endpoint for the POST method to execute SPARQL queries
@app.post("/api")
async def execute_sparql_query(request_body: QueryRequest):
    sparql_query = request_body.sparqlQuery
    fuseki_url = request_body.fusekiUrl
    fuseki_base_url, fuseki_username, fuseki_password = get_fuseki_details()
    sparql = SPARQLWrapper(fuseki_base_url + fuseki_url + "/query")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)

    if fuseki_username and fuseki_password:
        sparql.setHTTPAuth(DIGEST)
        sparql.setCredentials(fuseki_username, fuseki_password)
    
    try:
        results = sparql.query().convert()
        encoded_results = json.dumps(results)
        return Response(content=encoded_results, media_type="application/json")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error executing SPARQL query: {e}")

# Define the endpoint for the GET method to get the list of datasets
@app.get("/datasets")
async def get_datasets():
    fuseki_url, fuseki_username, fuseki_password = get_fuseki_details()
    datasets_url = f"{fuseki_url}/$/datasets"

    try:
        if fuseki_username and fuseki_password:
            response = requests.get(datasets_url, auth=(fuseki_username, fuseki_password))
        else:
            response = requests.get(datasets_url)

        if response.status_code == 200:
            datasets_info = response.json()
            datasets = datasets_info.get('datasets', [])
            dataset_names = [dataset.get('ds.name') for dataset in datasets]
            return dataset_names
        else:
            raise HTTPException(status_code=response.status_code, detail="Failed to retrieve datasets")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving datasets: {e}")

@app.get("/s2cells")
def get_s2_cells(lat: float, lng: float, level: int):
    lat_lng = LatLng.from_degrees(lat, lng)
    cell_id = CellId.from_lat_lng(lat_lng).parent(level)
    cell = Cell(cell_id)

    # Generate coordinates adjusted by 0.1 degrees
    cell_coordinates = [
        (lat + 0.1, lng),
        (lat, lng + 0.1),
        (lat - 0.1, lng),
        (lat, lng - 0.1)
    ]

    vertices = []
    for i in range(4):
        vertex = LatLng.from_point(cell.get_vertex(i))
        vertices.append((vertex.lat().degrees, vertex.lng().degrees))

    return cell_coordinates

if __name__ == "__main__":
    # Run the app using uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
