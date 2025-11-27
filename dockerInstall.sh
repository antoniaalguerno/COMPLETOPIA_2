#!/usr/bin/env bash
set -euo pipefail

log() {
  echo "=== $* ==="
}

log "Instalando paquetes previos de Docker"
sudo apt-get update -y || true
sudo apt-get install -y \
  ca-certificates \
  curl \
  gnupg \
  lsb-release

log "Configurando keyring oficial de Docker (método recomendado)"
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor --yes -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

log "Creando entrada estable de Docker en APT"
# VERSION_CODENAME está presente en /etc/os-release en todas las Ubuntu recientes.
. /etc/os-release
DOCKER_DIST="${VERSION_CODENAME:-$(lsb_release -cs)}"
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu ${DOCKER_DIST} stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

log "Instalando Docker Engine y plugins oficiales"
sudo apt-get update -y
sudo apt-get install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin

log "Habilitando y arrancando servicio Docker"
sudo systemctl enable docker
sudo systemctl start docker

log "Agregando usuario actual al grupo docker"
sudo usermod -aG docker "$USER"

log "Instalando Docker Compose clásico (binario)"
COMPOSE_VERSION="2.31.0"
sudo curl -L "https://github.com/docker/compose/releases/download/v${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo
echo "==============================================="
echo "Docker y Docker Compose han sido instalados según la guía oficial."
echo "Versión de Docker:"
docker --version || echo "Aún no disponible en esta sesión."
echo "Versión de Docker Compose (plugin):"
docker compose version || echo "Plugin aún no disponible en esta sesión."
echo "Versión de docker-compose (binario clásico):"
/usr/local/bin/docker-compose --version || echo "Binario no disponible."
echo
echo "IMPORTANTE: cierra sesión y vuelve a entrar para que el grupo 'docker'"
echo "se aplique a tu usuario (o ejecuta: newgrp docker)."
echo "==============================================="
