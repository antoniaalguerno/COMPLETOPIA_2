from bson import ObjectId
from core.mongo import products_collection

# Crear Producto
def create_product(data):
    result = products_collection.insert_one(data)
    return str(result.inserted_id)

# Lista completa de Productos
def get_products():
    products = list(products_collection.find())
    for p in products:
        p["_id"] = str(p["_id"])
    return products

# Solo 1 Producto
def get_product(product_id):
    product = products_collection.find_one({"_id": ObjectId(product_id)})
    if product:
        product["_id"] = str(product["_id"])
    return product

# Actualizar Producto
def update_product(product_id, data):
    products_collection.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": data}
    )

# Borrar Producto
def delete_product(product_id):
    products_collection.delete_one({"_id": ObjectId(product_id)})