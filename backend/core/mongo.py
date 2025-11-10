from pymongo import MongoClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "completopia_mongo")

client = MongoClient(MONGO_URI)
mongo_db = client[MONGO_DB]

# Colección de Productos
products_collection = mongo_db["products"]