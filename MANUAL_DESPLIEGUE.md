# Manual de despliegue reproducible de la infraestructura

Este documento describe el procedimiento estandarizado para levantar toda la
plataforma de **Completopia** usando los artefactos existentes en este
repositorio (`docker/docker-compose.yml`, Dockerfiles y scripts de arranque).
Siguiendo estos pasos siempre obtendrás el mismo resultado, sin dependencias en
configuraciones manuales locales.

## 1. Prerrequisitos

- Docker Engine 24.x o superior (Linux) o Docker Desktop (Windows/Mac).  
  Comprueba la instalación con `docker version`.
- Docker Compose Plugin v2 (`docker compose version`).
- Acceso a este repositorio y a las credenciales necesarias (secret key, SMTP,
  etc.).
- Puertos libres en el host: `15432`, `27017`, `8000` y `8080`.

> **Nota:** No necesitas instalar Python, Node ni bases de datos en el host; los
contenedores encapsulan todas las dependencias.

## 2. Preparación del código fuente

1. Clona el repositorio y entra en él:

   ```bash
   gh repo clone antoniaalguerno/COMPLETOPIA_2
   cd completopia
   ```

2. (Opcional) Selecciona la rama/etiqueta que quieras desplegar:

   ```bash
   git checkout <rama-o-tag>
   ```

3. Verifica que ves los directorios `backend/`, `frontend/` y `docker/`, ya que
   son los que usa la infraestructura.

## 3. Configuración de variables de entorno

El archivo `backend/.env` es la única fuente de variables para todos los
servicios definidos en `docker/docker-compose.yml`. Para generarlo:

1. Copia el template incluido:

   ```bash
   cp backend/.env.example backend/.env
   ```

2. Edita `backend/.env` y completa los valores sensibles. Recomendaciones para
   un despliegue con Docker:

   | Variable                           | Valor sugerido / comentario                                                |
   |------------------------------------|----------------------------------------------------------------------------|
   | `SECRET_KEY`                       | Clave segura generada aleatoriamente.                                      |
   | `DEBUG`                            | `False` en ambientes reproducibles.                                        |
   | `ALLOWED_HOSTS`                    | Dominios o IP donde publicarás Nginx.                                      |
   | `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | Ajusta según tus políticas.                                            |
   | `DB_HOST`                          | Usa `db` (nombre del servicio) en vez de `localhost`.                      |
   | `DB_PORT`                          | `5432` internamente (el puerto 15432 se expone hacia el host).             |
   | `MONGO_URI`                        | `mongodb://mongo:27017` para que el backend alcance al contenedor.        |
   | `MONGO_USERNAME` / `MONGO_PASSWORD`| Deben coincidir con las variables usadas por `docker/mongo`.               |
   | `DJANGO_SUPERUSER_*`               | (Opcionales) Si las defines, el entrypoint creará el superusuario.         |
   | `VITE_API_BASE_URL`                | URL pública del backend (`https://tu-dominio/api/`).                       |
   | `CSRF_TRUSTED_ORIGINS`, `CORS_ALLOWED_ORIGINS` | Incluye tu dominio y `http://localhost:8080` si harás pruebas locales. |
   | Parámetros SMTP                    | Credenciales válidas para el emisor configurado.                           |

3. Guarda el archivo. No lo comités al repositorio (está ignorado por defecto).

## 4. Construcción de imágenes

Todas las imágenes (PostgreSQL, Mongo con seed, backend y frontend estático)
están definidas en `docker/`. Ejecuta desde la raíz del repo:

```bash
sudo docker compose -f docker/docker-compose.yml build
```

Este comando:

- Instala las dependencias Python declaradas en `backend/requirements.txt`.
- Empaqueta la app frontend (Vite) y la publica como assets estáticos servidos
  por Nginx.
- Empaqueta las imágenes personalizadas de PostgreSQL (`docker/bd`) y Mongo
  (`docker/mongo`) que incluyen scripts de inicialización.

Si actualizas código o dependencias, vuelve a ejecutar `--build` para reproducir
los cambios.

## 5. Despliegue de la infraestructura

1. Levanta todos los servicios en segundo plano:

   ```bash
   docker compose -f docker/docker-compose.yml up -d
   ```

   El orden de arranque respeta las dependencias declaradas (`backend` espera a
   `db` y `mongo`).

2. Verifica el estado:

   ```bash
   docker compose -f docker/docker-compose.yml ps
   ```

3. Inspecciona los logs del backend mientras aplica migraciones, colecta
   estáticos y (si procede) crea el superusuario:

   ```bash
   docker compose -f docker/docker-compose.yml logs -f backend
   ```

4. Accede a la aplicación vía navegador en `http://localhost:8080` (o en el
   dominio configurado para Nginx). Las rutas `/api/` y `/admin/` se proxifican
   hacia el backend en `http://backend:8000`.

### ¿Qué ocurre durante el arranque?

- `db` crea la base Postgres inicial usando las variables `POSTGRES_*`.
- `mongo` ejecuta `docker/mongo/init-db.sh`, el cual levanta Mongo, aplica los
  seeds (`init-products.js`) y queda escuchando en `27017`.
- `backend` corre `python manage.py migrate`, `collectstatic` y arranca
  Gunicorn en `8000`.
- `frontend` construye los assets y Nginx sirve la SPA y expone `/static` y
  `/media` montados desde volúmenes compartidos.

## 6. Validaciones post-despliegue

1. **Salud de servicios:** `docker compose ps` debe mostrar todos en `running`.
2. **Conectividad backend:** `curl http://localhost:8080/api/health` (o la ruta
   que corresponda) debería responder 200.
3. **Archivos estáticos:** Comprueba que `docker volume ls` incluya
   `static_volume` y `media_volume`.
4. **Datos persistentes:** reinicia sólo las bases para validar que los datos
   sobreviven dentro de los volúmenes:

   ```bash
   docker compose -f docker/docker-compose.yml restart db mongo
   ```

5. **Usuario administrador:** si configuraste `DJANGO_SUPERUSER_*`, inicia sesión
   en `/admin/` con esas credenciales.

## 7. Operación y mantenimiento

- **Detener la plataforma:**  
  `docker compose -f docker/docker-compose.yml down`

- **Detener conservando volúmenes y luego arrancar de nuevo:**  
  `docker compose -f docker/docker-compose.yml stop`  
  `docker compose -f docker/docker-compose.yml start`

- **Actualizar código y volver a desplegar:**  
  `git pull`  
  `docker compose -f docker/docker-compose.yml up -d --build`

- **Respaldos:** los datos viven en los volúmenes definidos (`db_data`,
  `mongo_data`, `static_volume`, `media_volume`). Puedes exportarlos con
  `docker run --rm -v db_data:/var/lib/postgresql/data -v "$PWD":/backup alpine tar czf /backup/db.tgz /var/lib/postgresql/data`.

- **Monitoreo / diagnóstico:**  
  `docker compose -f docker/docker-compose.yml logs -f <servicio>`  
  `docker compose -f docker/docker-compose.yml exec backend python manage.py showmigrations`

- **Cambiar dominio o puertos:** ajusta `docker/nginx/default.conf` y actualiza
  las variables `ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS` y `VITE_API_BASE_URL`
  antes de reconstruir la imagen del frontend.

## 8. Solución de problemas frecuentes

- **El backend no levanta porque no conecta a Postgres:** revisa que `DB_HOST=db`
  dentro de `backend/.env`. Comprueba el estado de `db` con
  `docker compose logs db`.
- **Archivos estáticos no se ven:** asegúrate de que `backend` ejecutó
  `collectstatic` (ver logs) y que los volúmenes `static_volume` y `media_volume`
  están montados. Reinicia `frontend` si cambiaste assets.
- **Cambios del frontend no aparecen:** corre
  `docker compose -f docker/docker-compose.yml up -d --build frontend` para
  regenerar la imagen con el nuevo bundle.
- **Necesito credenciales de administrador adicionales:** usa
  `docker compose -f docker/docker-compose.yml exec backend python manage.py createsuperuser`
  o define nuevos valores `DJANGO_SUPERUSER_*` y reinicia `backend`.

---

Con este manual puedes reproducir el despliegue en cualquier servidor compatible
con Docker, manteniendo la misma configuración y evitando pasos manuales fuera
de control.
