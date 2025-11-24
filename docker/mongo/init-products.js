// Mongo init script that seeds the products collection the first time the
// database is created. It runs automatically thanks to the official Mongo
// image executing every script inside /docker-entrypoint-initdb.d/.

const database = db.getSiblingDB("completopia_mongo");
const products = database.getCollection("products");

const defaultProducts = [
  {
    supply_name: "Palta Hass",
    supply_code: "SKU0001",
    supply_unit: "kg",
    supply_initial_stock: 50,
    supply_input: 10,
    supply_output: 5,
  },
  {
    supply_name: "Tomate",
    supply_code: "SKU0002",
    supply_unit: "kg",
    supply_initial_stock: 80,
    supply_input: 15,
    supply_output: 7,
  },
  {
    supply_name: "Bebida Cola",
    supply_code: "SKU0003",
    supply_unit: "LATA (330 ml)",
    supply_initial_stock: 120,
    supply_input: 20,
    supply_output: 30,
  },
  {
    supply_name: "Agua Mineral",
    supply_code: "SKU0004",
    supply_unit: "LATA (330 ml)",
    supply_initial_stock: 100,
    supply_input: 0,
    supply_output: 10,
  },
  {
    supply_name: "Limón",
    supply_code: "SKU0005",
    supply_unit: "kg",
    supply_initial_stock: 40,
    supply_input: 5,
    supply_output: 2,
  },
];

if (products.countDocuments() === 0) {
  const result = products.insertMany(defaultProducts);
  print(
    `[mongo-init] Insertados ${Object.keys(result.insertedIds).length} productos demo`
  );
} else {
  print("[mongo-init] Colección 'products' ya tiene datos; se omite el seed");
}
