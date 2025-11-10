# Simple Postgres image for the project's database
# Uses official lightweight PostgreSQL base image
FROM postgres:16-alpine

# Optional: set timezone if desired (uncomment if you need it)
# RUN apk add --no-cache tzdata && \
#     cp /usr/share/zoneinfo/America/Santiago /etc/localtime && \
#     echo "America/Santiago" > /etc/timezone

# No extra steps required; configuration is provided via environment variables
# in docker-compose. The base image will create the database and roles
# based on POSTGRES_* env vars and run any scripts placed in
# /docker-entrypoint-initdb.d/ on first startup.

