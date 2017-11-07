web: python manage.py runworker --settings=footballsite.settings -v2
daphne: daphne footballsite.asgi:channel_layer --port $PORT --bind 0.0.0.0 -v2
server: python manage.py collectstatic --noinput; gunicorn footballsite.wsgi --log-file -

