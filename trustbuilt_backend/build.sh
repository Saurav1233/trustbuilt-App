#!/usr/bin/env bash
set -e

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate

python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()

# Update existing admin or create new one
try:
    user = User.objects.get(username='admin')
    user.email = 'trustbuilt2026@gmail.com'
    user.set_password('Admin@123456')
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print('Superuser updated successfully')
except User.DoesNotExist:
    User.objects.create_superuser(
        username='admin',
        email='trustbuilt2026@gmail.com',
        password='Admin@123456'
    )
    print('Superuser created successfully')
"