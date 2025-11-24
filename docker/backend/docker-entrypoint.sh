#!/usr/bin/env sh
set -e

# wait for Postgres if host is provided
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

# Apply migrations and collect static files
python manage.py migrate --noinput
python manage.py collectstatic --noinput

# Start Gunicorn
exec gunicorn main_app.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers "${GUNICORN_WORKERS:-3}" \
  --timeout "${GUNICORN_TIMEOUT:-60}"

