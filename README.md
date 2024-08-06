# Setting up Node.js, FastAPI, Client Application, and Fuseki Server

This guide will walk you through the process of setting up Node.js 14, creating a virtual environment for FastAPI, installing npm dependencies for a client application, and setting up a Fuseki server for RDF data storage.

## Installing Node.js 14

1. **Download Node.js 14**: 
   - Go to the [Node.js website](https://nodejs.org/).
   - Download the Node.js 14 installer suitable for your operating system.
   - Follow the installation instructions.

2. **Verify Installation**:
   - Open a terminal or command prompt.
   - Type `node -v` and press Enter. You should see the Node.js version displayed (e.g., `v14.x.x`).
   - Type `npm -v` and press Enter. You should see the npm version displayed.

## Setting up FastAPI Server

1. **Navigate to the Server Folder**:
   - Open a terminal or command prompt.
   - Change directory to the folder where your FastAPI server will reside.

2. **Create a Python Virtual Environment**:
   - Run the following command to create a virtual environment named `venv`:
     ```
     python3 -m venv venv
     ```

3. **Activate the Virtual Environment**:
   - Activate the virtual environment by running the appropriate command for your operating system:
     - On Windows:
       ```
       venv\Scripts\activate
       ```
     - On macOS and Linux:
       ```
       source venv/bin/activate
       ```

4. **Install FastAPI and Uvicorn**:
   - With the virtual environment activated, install FastAPI and Uvicorn using pip:
     ```
     pip install fastapi uvicorn pydantic SPARQLWrapper python-dotenv s2sphere
     ```

5. **Run the FastAPI Server**:
   - With your virtual environment activated and inside the chosen folder, run the following command:
     ```
     uvicorn main:app --reload --port 8000
     ```
   - This command tells Uvicorn to run your FastAPI application (`main.py`) with automatic reloading enabled on port 8000.

## Setting up a Client with npm

1. **Navigate to the Client Folder**:
   - Open a terminal or command prompt.
   - Change directory to the folder where your client application will reside.

2. **Node Version 14**:
   - Inside the client folder, check the node version. 

3. **Install npm Dependencies**:
   - Inside the client folder, you can now install npm dependencies using the following command:
     ```
     npm i
     ```
4. Start the front end application
   - Inside the client folder, you can now start the frontend application using: 
     ```
     npm start
     ```
This will start the application at 3000 port.
## Setting up a Fuseki Server

- Check if the Fuseki Server is running in port 3030 and it starts the Fuseki server with an in-memory dataset named `/ds` that supports SPARQL update operations.
- After that upload the owl file in the datastore. 

## Additional Notes

- Remember to deactivate the virtual environment (`deactivate`) when you're finished working with your FastAPI server.
- The client application runs independently and can be served using tools like `create-react-app`, Vue CLI, or any other appropriate framework or setup.
- Ensure to configure your client application to communicate with the FastAPI server appropriately.
- Fuseki provides a web interface that you can access in your browser at `http://localhost:3000`.

