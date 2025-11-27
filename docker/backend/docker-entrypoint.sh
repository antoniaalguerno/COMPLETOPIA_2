#!/usr/bin/env sh
set -e

if [ -n "${DB_HOST}" ]; then
  echo "Esperando a Postgres en ${DB_HOST}:${DB_PORT:-5432}..."
  python - <<'PYCODE'
import os, socket, time, sys
host = os.environ.get("DB_HOST")
port = int(os.environ.get("DB_PORT", "5432"))
for _ in range(120):
    s = socket.socket()
    s.settimeout(1)
    try:
        s.connect((host, port))
        s.close()
        print("Base de datos disponible")
        sys.exit(0)
    except Exception:
        time.sleep(1)
print("Timeout esperando la base de datos", file=sys.stderr)
sys.exit(1)
PYCODE
fi

python manage.py migrate --noinput
python manage.py collectstatic --noinput

if [ -n "${DJANGO_SUPERUSER_USERNAME}" ] && \
   [ -n "${DJANGO_SUPERUSER_EMAIL}" ] && \
   [ -n "${DJANGO_SUPERUSER_PASSWORD}" ]; then
  echo "Verificando superusuario predeterminado..."
  python manage.py shell <<'PYCODE'
import os
from django.contrib.auth import get_user_model

username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

User = get_user_model()
if User.objects.filter(username=username).exists():
    print(f"Superusuario '{username}' ya existe, omitiendo creación")
else:
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"Superusuario '{username}' creado automáticamente")
PYCODE
else
  echo "Variables DJANGO_SUPERUSER_* ausentes; omitiendo creación de superusuario"
fi

exec gunicorn main_app.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers "${GUNICORN_WORKERS:-3}" \
  --timeout "${GUNICORN_TIMEOUT:-60}"
