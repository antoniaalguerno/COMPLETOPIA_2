# Manual “paso a paso” para que cualquier persona pueda levantar la infraestructura desde cero, sin adivinar nada.
- Instalación de Docker y Docker Compose.
- Cómo clonar/descargar el repositorio con el código.
`gh repo clone antoniaalguerno/COMPLETOPIA_2`
`cd /COMPLETOPIA_2`
`CHMOD AL SCRIPT 1`
- Explicación de los archivos clave de despliegue:
    - docker-compose.yml
    - Dockerfile de cada servicio (frontend, backend, DB relacional, DB documental, servidor web, servidor de correo).

- Pasos concretos para:
    - Levantar los contenedores (docker compose up ...).
    - Verificar que cada servicio está funcionando:
        - Frontend accesible por navegador.
        - Backend respondiendo a las APIs.
        - BD accesible y conectada desde la app.
        - Proxy/servidor web exponiendo el frontend con la configuración que definan.
- Cómo parar/reiniciar la infraestructura (bajar contenedores, reconstruir, etc.).
- Cualquier variable de entorno o archivo .env necesario (aunque sea con ejemplos).