#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="${SCRIPT_DIR}/docker/docker-compose.yml"
ENV_FILE="${SCRIPT_DIR}/backend/.env"

if [ ! -f "${COMPOSE_FILE}" ]; then
  echo "No se encontró ${COMPOSE_FILE}. Ejecuta este script desde la raíz del repositorio." >&2
  exit 1
fi

if [ ! -f "${ENV_FILE}" ]; then
  echo "backend/.env no existe. Ejecuta ./createEnv.sh y configura las variables necesarias antes de continuar." >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker no está instalado o no está en el PATH. Instálalo (por ejemplo, con ./dockerInstall.sh)." >&2
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "El plugin 'docker compose' no está disponible. Asegúrate de tener Docker Compose v2 instalado." >&2
  exit 1
fi

DOCKER_CMD=(docker)
if ! docker info >/dev/null 2>&1; then
  if command -v sudo >/dev/null 2>&1; then
    echo "Docker requiere privilegios elevados. Intentando usar sudo..."
    DOCKER_CMD=(sudo docker)
    if ! "${DOCKER_CMD[@]}" info >/dev/null 2>&1; then
      echo "Incluso con sudo no se pudo contactar con el daemon de Docker." >&2
      exit 1
    fi
  else
    echo "No tienes permisos para hablar con el daemon de Docker y no hay sudo disponible." >&2
    exit 1
  fi
fi

COMPOSE_CMD=("${DOCKER_CMD[@]}" compose -f "${COMPOSE_FILE}")

echo "=== Construyendo imágenes definidas en docker/docker-compose.yml ==="
"${COMPOSE_CMD[@]}" build

echo "=== Levantando servicios en segundo plano ==="
"${COMPOSE_CMD[@]}" up -d

echo "=== Estado actual de los contenedores ==="
"${COMPOSE_CMD[@]}" ps

cat <<'EOF'

Los servicios están corriendo. Comandos útiles:
  docker compose -f docker/docker-compose.yml logs -f backend    # Ver logs del backend
  docker compose -f docker/docker-compose.yml down               # Apagar la infraestructura

EOF
