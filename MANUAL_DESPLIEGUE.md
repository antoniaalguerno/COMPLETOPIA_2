# Manual de despliegue reproducible

Guía corta para levantar **Completopia** usando únicamente los artefactos del repositorio (`docker/`, Dockerfiles y scripts). Todo sucede en contenedores, por lo que no necesitas instalar dependencias globales.

## Flujo recomendado

| Escenario                         | Ruta sugerida                                          |
|-----------------------------------|--------------------------------------------------------|
| Ubuntu recién instalado           | `./dockerInstall.sh` ➜ `./deployUbuntu.sh`             |
| Host ya con Docker                | `./deployDocker.sh` (build + up + verificación)        |
| Otros SO o ejecución manual       | Seguir secciones 1–7 de este documento                 |

Los scripts se ejecutan desde la raíz (`/COMPLETOPIA_2`) y puedes mezclarlos con los pasos manuales según convenga.

## 1. Prerrequisitos

- Docker Engine 24+ (Linux) o Docker Desktop; verifica con `docker version`.
- Docker Compose Plugin v2 (`docker compose version`).
- Acceso al repo y a las credenciales de `.env`, SMTP, etc.
- Puertos libres `15432`, `27017`, `8000`, `8080`.
- En Ubuntu sin Docker, ejecuta `./dockerInstall.sh` y vuelve a iniciar sesión para quedar en el grupo `docker`.

## 2. Preparación del código fuente

1. Clona y entra al proyecto:

   ```bash
   gh repo clone antoniaalguerno/COMPLETOPIA_2
   cd COMPLETOPIA_2
   ```

2. Cambia de rama/tag si aplica: `git checkout <rama-o-tag>`.
3. Verifica que existan `backend/`, `frontend/` y `docker/`.
4. Da permisos de ejecución (útil al copiar a otro host):

   ```bash
   chmod +x deployUbuntu.sh deployDocker.sh createEnv.sh dockerInstall.sh
   ```

## 3. Variables de entorno

`backend/.env` concentra todas las variables usadas en `docker/docker-compose.yml`.

1. Genera el archivo: `cp backend/.env.example backend/.env` o `./createEnv.sh`.
2. Completa los valores necesarios:

   | Variable                                   | Nota rápida                                      |
   |--------------------------------------------|--------------------------------------------------|
   | `SECRET_KEY`                                | Clave aleatoria segura.                          |
   | `DEBUG`                                     | `False` en despliegues reproducibles.            |
   | `ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS`     | Dominios reales + `localhost` si pruebas local.  |
   | `POSTGRES_*`, `DB_HOST`, `DB_PORT`          | Usa `db`/`5432`; el host expone `15432`.         |
   | `MONGO_*`                                   | Host `mongo`, credenciales alineadas al seed.    |
   | `DJANGO_SUPERUSER_*`                        | Opcional para autocrear admin.                   |
   | `VITE_API_BASE_URL`                         | URL pública del backend (ej. `https://dominio/api/`). |
   | Parámetros SMTP                             | Credenciales válidas para envíos.                |

El archivo está ignorado en Git.

## 4. Construcción de imágenes

Todo vive en `docker/`. Ejecuta una sola vez (o cuando haya cambios):

```bash
docker compose -f docker/docker-compose.yml build
```

`deployDocker.sh` incluye este paso automáticamente.

## 5. Despliegue

1. Levanta servicios:

   ```bash
   docker compose -f docker/docker-compose.yml up -d
   ```

2. Comprueba el estado: `docker compose -f docker/docker-compose.yml ps`.
3. Sigue los logs del backend (migraciones, estáticos, superusuario):

   ```bash
   docker compose -f docker/docker-compose.yml logs -f backend
   ```

4. Navega a `http://localhost:8080` o al dominio configurado (Nginx expone `/`, `/api/`, `/admin/`).

`deployUbuntu.sh` encadena validaciones del SO, creación de `.env`, export de variables, `build` y `up -d`. Úsalo si estás en ese escenario.

### ¿Qué ocurre al iniciar?

- `db`: inicializa PostgreSQL con `POSTGRES_*`.
- `mongo`: ejecuta `docker/mongo/init-db.sh` e importa seeds.
- `backend`: corre `migrate`, `collectstatic`, carga fixtures y expone Gunicorn en `8000`.
- `frontend`: construye el bundle de Vite y Nginx sirve SPA + `/static`/`/media`.

## 6. Validaciones post-despliegue

1. `docker compose ps` → todos en `running`.
2. `curl http://localhost:8080/api/health` → responde 200 (ajusta al dominio real).
3. `docker volume ls` → aparecen `static_volume` y `media_volume`.
4. Reinicia sólo las bases y confirma que los datos persisten:

   ```bash
   docker compose -f docker/docker-compose.yml restart db mongo
   ```

5. Entra a `/admin/` con las credenciales declaradas en `DJANGO_SUPERUSER_*`.

## 7. Operación y mantenimiento

- Apagar todo: `docker compose -f docker/docker-compose.yml down`.
- Detener/arrancar conservando volúmenes: `docker compose -f docker/docker-compose.yml stop` y `start`.
- Actualizar código + redeploy: `git pull` y `docker compose -f docker/docker-compose.yml up -d --build`.
- Respaldos: volúmenes `db_data`, `mongo_data`, `static_volume`, `media_volume`. Ejemplo Postgres:

  ```bash
  docker run --rm -v db_data:/var/lib/postgresql/data -v "$PWD":/backup alpine \
    tar czf /backup/db.tgz /var/lib/postgresql/data
  ```

- Monitoreo: `docker compose -f docker/docker-compose.yml logs -f <servicio>` o `exec backend python manage.py showmigrations`.
- Cambios de dominios/puertos: editar `docker/nginx/default.conf`, actualizar `ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS`, `VITE_API_BASE_URL` y reconstruir el frontend.

## 8. Problemas frecuentes

- **Sin permisos para Docker:** tras `./dockerInstall.sh`, ejecuta `newgrp docker` o vuelve a iniciar sesión.
- **Puertos ocupados:** revisa con `ss -tulpn` antes de levantar los contenedores.
- **Variables faltantes:** `docker compose -f docker/docker-compose.yml logs backend` indicará qué clave falta en `.env`.
- **Seeds de Mongo incompletos:** mira `docker compose logs mongo`, elimina sólo el volumen `mongo_data` y vuelve a levantar.
- **Migraciones pendientes o cambios de modelo:** `docker compose down`, `git pull`, `docker compose up -d --build`.
- **Frontend desactualizado:** forza rebuild: `docker compose -f docker/docker-compose.yml up -d --build frontend`.

Con estos pasos mantienes un despliegue reproducible, trazable y sencillo de operar.
