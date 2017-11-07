web: daphne footballsite.asgi:channel_layer --port $PORT --bind 0.0.0.0 -v2
worker: python manage.py collectstatic --noinput; python manage.py migrate; python manage.py runworker --settings=footballsite.settings -v2
server: python manage.py collectstatic --noinput; gunicorn footballsite.wsgi --log-file -
