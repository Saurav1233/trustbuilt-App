from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_contact_inquiry_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='Consultation',
            fields=[
                ('id',         models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name',       models.CharField(max_length=200)),
                ('email',      models.EmailField(max_length=254)),
                ('phone',      models.CharField(max_length=20)),
                ('message',    models.TextField()),
                ('status',     models.CharField(
                                choices=[
                                    ('new',         'New'),
                                    ('contacted',   'Contacted'),
                                    ('in_progress', 'In Progress'),
                                    ('closed',      'Closed'),
                                ],
                                default='new',
                                max_length=20,
                               )),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name':        'Consultation Request',
                'verbose_name_plural': 'Consultation Requests',
                'ordering':            ['-created_at'],
            },
        ),
    ]