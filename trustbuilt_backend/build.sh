#!/usr/bin/env bash
set -e

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate

# Create superuser with your real email
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='trustbuilt2026@gmail.com').exists():
    User.objects.create_superuser(
        username='admin',
        email='trustbuilt2026@gmail.com',
        password='Admin@2026'
    )
    print('Superuser created')
else:
    print('Superuser already exists')
"