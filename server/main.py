from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from SPARQLWrapper import SPARQLWrapper, DIGEST, JSON
import uvicorn
import json
import os
app = FastAPI()

# Create a Pydantic model to represent the request body
class QueryRequest(BaseModel):
    fusekiUrl: str
    sparqlQuery: str

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Allow the specified methods
    allow_headers=["*"],  # Allow all headers
)

# Define the endpoint for the POST method
@app.post("/api")
async def execute_sparql_query(request_body: QueryRequest):
    # Extract Fuseki URL and SPARQL query from the request body
    fuseki_url = request_body.fusekiUrl
    sparql_query = request_body.sparqlQuery

    # Print the Fuseki URL and SPARQL query
    
    # Create a SPARQLWrapper instance and set the endpoint URL
    sparql = SPARQLWrapper(fuseki_url)
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)

    # Use environment variables for credentials
    fuseki_username = os.getenv("FUSEKI_USERNAME")
    fuseki_password = os.getenv("FUSEKI_PASSWORD")

    if fuseki_username and fuseki_password:
        sparql.setHTTPAuth(DIGEST)
        sparql.setCredentials(fuseki_username, fuseki_password)
    
    # Execute the SPARQL query
    try:
        results = sparql.query().convert()
        encoded_results = json.dumps(results)
        print(encoded_results)
        return Response(content=encoded_results, media_type="application/json")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error executing SPARQL query: {e}")