#!/usr/bin/env bash
set -e

# 1) Arrancar el entrypoint original de Mongo (crea usuario root, corre scripts .js, etc.)
/usr/local/bin/docker-entrypoint.sh "$@" &

pid="$!"

echo "[mongo-init] Esperando a que MongoDB esté listo..."
until mongosh --quiet --eval 'db.runCommand({ ping: 1 })' > /dev/null 2>&1; do
  sleep 1
done

echo "[mongo-init] Ejecutando seed-products.js (idempotente)..."
mongosh "mongodb://root:example@localhost:27017/completopia_mongo?authSource=admin" \
  /docker-entrypoint-initdb.d/seed-products.js || true

# 3) Esperar al proceso real de mongod
wait "$pid"
