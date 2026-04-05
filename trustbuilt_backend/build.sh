#!/usr/bin/env bash
set -e

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate

python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()

try:
    user = User.objects.get(username='admin')
    user.email = 'trustbuilt2026@gmail.com'
    user.set_password('Admin@2026')
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print('Admin updated: trustbuilt2026@gmail.com / Admin@2026')
except User.DoesNotExist:
    User.objects.create_superuser(
        username='admin',
        email='trustbuilt2026@gmail.com',
        password='Admin@2026'
    )
    print('Admin created: trustbuilt2026@gmail.com / Admin@2026')
"