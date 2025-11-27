from pymongo import MongoClient
import os

# Prefer the new init variable names but keep backward compatibility
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv(
    "MONGO_INITDB_DATABASE",
    os.getenv("MONGO_DB", "completopia_mongo"),
)
MONGO_USERNAME = os.getenv("MONGO_INITDB_ROOT_USERNAME", os.getenv("MONGO_USERNAME"))
MONGO_PASSWORD = os.getenv("MONGO_INITDB_ROOT_PASSWORD", os.getenv("MONGO_PASSWORD"))
MONGO_AUTH_SOURCE = os.getenv("MONGO_AUTH_SOURCE")

mongo_client_kwargs = {}
if MONGO_USERNAME and MONGO_PASSWORD:
    mongo_client_kwargs["username"] = MONGO_USERNAME
    mongo_client_kwargs["password"] = MONGO_PASSWORD
    if MONGO_AUTH_SOURCE:
        mongo_client_kwargs["authSource"] = MONGO_AUTH_SOURCE

client = MongoClient(MONGO_URI, **mongo_client_kwargs)
mongo_db = client[MONGO_DB]

# Colección de Productos
products_collection = mongo_db["products"]
