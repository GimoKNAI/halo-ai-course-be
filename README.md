# Halo AI Course Project - NestJS POC

This is a practical project / proof of concept (POC) based on the AI course by Halo Media.

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js & NPM
- Docker
- Python
- ChromaDB

## Installation

Once the prerequisites are installed, install the project dependencies:

## Environment Setup

Create a `.env` file based on `src/environment/default.env`.  
Replace any necessary values; **at least the Gemini API key is required**.

## Running ChromaDB with Docker

Before starting the application, ensure Docker Desktop is running and execute the following command:

## Running the Project

Once ChromaDB is running, start the NestJS project in development mode:

## Usage Notes

- To use the chatbot, you must first submit a form via the **Survey Controller**.  
  This ensures that at least one embedding exists and creates a minimal dataset.

- It is recommended to use the **Postman collection** provided in the repository:  

  `Halo - AI Course Project.postman_collection.json`  

  This collection includes documentation and examples on how to use each endpoint easily.
