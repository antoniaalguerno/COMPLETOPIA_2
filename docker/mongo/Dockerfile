# syntax=docker/dockerfile:1

# Base image containing MongoDB server and tools
FROM mongo:7.0

# Default database name for initialization scripts (if any are mounted later)
ENV MONGO_INITDB_DATABASE=completopia_mongo

# Seed the products collection on first run
COPY init-products.js /docker-entrypoint-initdb.d/seed-products.js

COPY init-db.sh /usr/local/bin/init-db.sh
RUN chmod +x /usr/local/bin/init-db.sh

# Expose MongoDB default port (optional, mostly for documentation)
EXPOSE 27017

ENTRYPOINT ["init-db.sh"]
CMD ["mongod"]
