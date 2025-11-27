#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="${SCRIPT_DIR}/docker/docker-compose.yml"
CREATE_ENV_SCRIPT="${SCRIPT_DIR}/createEnv.sh"
ENV_FILE="${SCRIPT_DIR}/backend/.env"

ensure_ubuntu() {
  if [ ! -r /etc/os-release ]; then
    echo "No se pudo verificar el sistema operativo (falta /etc/os-release)." >&2
    exit 1
  fi

  # shellcheck disable=SC1091
  . /etc/os-release
  if [[ "${ID,,}" != "ubuntu" && "${ID_LIKE:-}" != *ubuntu* ]]; then
    echo "Este script está diseñado para Ubuntu. Detectado: ${NAME:-desconocido}." >&2
    exit 1
  fi
}

require_file() {
  local path="$1"
  local message="$2"
  if [ ! -f "${path}" ]; then
    echo "${message}" >&2
    exit 1
  fi
}

ensure_env_file() {
  require_file "${CREATE_ENV_SCRIPT}" "No se encontró ${CREATE_ENV_SCRIPT}."
  if [ ! -f "${ENV_FILE}" ]; then
    echo "backend/.env no existe. Ejecutando createEnv..."
    bash "${CREATE_ENV_SCRIPT}"
  else
    echo "backend/.env ya existe. Se utilizará tal cual."
  fi
}

load_env_file() {
  echo "Exportando variables desde backend/.env"
  set -a
  # shellcheck disable=SC1091
  . "${ENV_FILE}"
  set +a
}

ensure_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    echo "Docker no está instalado. Ejecuta ./dockerInstall.sh y vuelve a intentar." >&2
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
      echo "No se pudo contactar con el daemon de Docker y sudo no está disponible." >&2
      exit 1
    fi
  fi

  if ! "${DOCKER_CMD[@]}" compose version >/dev/null 2>&1; then
    echo "El plugin 'docker compose' no está disponible. Instálalo antes de continuar." >&2
    exit 1
  fi
}

run_compose() {
  local -a compose_cmd=("${DOCKER_CMD[@]}" compose -f "${COMPOSE_FILE}")
  echo "=== Construyendo imágenes definidas en docker/docker-compose.yml ==="
  "${compose_cmd[@]}" build

  echo "=== Levantando servicios en segundo plano ==="
  "${compose_cmd[@]}" up -d

  echo "=== Estado actual de los contenedores ==="
  "${compose_cmd[@]}" ps
}

main() {
  ensure_ubuntu
  require_file "${COMPOSE_FILE}" "No se encontró ${COMPOSE_FILE}. Ejecuta el script desde la raíz del repositorio."
  ensure_env_file
  load_env_file
  ensure_docker
  run_compose

  cat <<'EOF'

Los servicios están corriendo. Comandos útiles:
  docker compose -f docker/docker-compose.yml logs -f backend    # Ver logs del backend
  docker compose -f docker/docker-compose.yml down               # Apagar la infraestructura

EOF
}

main "$@"
