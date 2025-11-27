#!/usr/bin/env bash
set -e

echo "=== Actualizando sistema ==="
sudo apt-get update -y
sudo apt-get upgrade -y

echo "=== Instalando paquetes previos ==="
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

echo "=== Agregando clave GPG oficial de Docker ==="
sudo install -m 0755 -d /etc/apt/keyrings
if [ ! -f /etc/apt/keyrings/docker.gpg ]; then
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
fi
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "=== Agregando repositorio Docker ==="
UBUNTU_CODENAME=$(lsb_release -cs)
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  ${UBUNTU_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

echo "=== Instalando Docker Engine y plugins ==="
sudo apt-get update -y
sudo apt-get install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin

echo "=== Habilitando y arrancando servicio Docker ==="
sudo systemctl enable docker
sudo systemctl start docker

echo "=== Agregando usuario actual al grupo docker ==="
sudo usermod -aG docker "$USER"

echo "=== Instalando Docker Compose clásico (binario) ==="
COMPOSE_VERSION="2.31.0"
sudo curl -L "https://github.com/docker/compose/releases/download/v${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo
echo "==============================================="
echo "Docker y Docker Compose han sido instalados."
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
