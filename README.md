# COMPLETOPIA
Proyecto especialidad 01 Universidad Autonoma 2024
Cristobal Pardo
Karen Cordova
Antonia Perez
David Muñoz

## Superusuario automático de Django

Al iniciar el contenedor del backend se ejecutarán las migraciones y, si existen las variables de entorno `DJANGO_SUPERUSER_USERNAME`, `DJANGO_SUPERUSER_EMAIL` y `DJANGO_SUPERUSER_PASSWORD`, se creará (o verificará) automáticamente un superusuario con esas credenciales. Añade estas variables al archivo `backend/.env` o a las variables de entorno del servicio antes de levantar Docker Compose.
