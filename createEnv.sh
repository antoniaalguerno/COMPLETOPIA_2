#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_DIR="${SCRIPT_DIR}/backend"
SOURCE_FILE="${ENV_DIR}/.env.example"
TARGET_FILE="${ENV_DIR}/.env"

if [ ! -f "${SOURCE_FILE}" ]; then
  echo "No se encontró el template ${SOURCE_FILE}" >&2
  exit 1
fi

if [ -f "${TARGET_FILE}" ]; then
  read -rp "backend/.env ya existe. ¿Deseas sobrescribirlo? [y/N]: " confirm
  case "${confirm}" in
    [yY]|[yY][eE][sS])
      ;;
    *)
      echo "Operación cancelada."
      exit 0
      ;;
  esac
fi

cp "${SOURCE_FILE}" "${TARGET_FILE}"
echo "backend/.env creado a partir de backend/.env.example."
