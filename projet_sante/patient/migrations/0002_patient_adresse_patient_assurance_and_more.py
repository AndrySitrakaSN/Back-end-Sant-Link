# Generated by Django 5.1 on 2025-06-20 11:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patient', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='patient',
            name='adresse',
            field=models.TextField(default='Non renseignée'),
        ),
        migrations.AddField(
            model_name='patient',
            name='assurance',
            field=models.CharField(default='Aucune', max_length=100),
        ),
        migrations.AddField(
            model_name='patient',
            name='contact_urgence',
            field=models.CharField(default='Inconnu', max_length=100),
        ),
        migrations.AddField(
            model_name='patient',
            name='email',
            field=models.EmailField(blank=True, max_length=100, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='patient',
            name='telephone',
            field=models.CharField(default='0000000000', max_length=20),
        ),
    ]
