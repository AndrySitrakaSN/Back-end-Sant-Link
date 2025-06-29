# Generated by Django 5.2.3 on 2025-06-20 19:08

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('patient', '0003_rename_nom_patient_nom_complet_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Consultation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_consultation', models.DateField()),
                ('medecin', models.CharField(default='Rakotomalala', max_length=100)),
                ('motif', models.TextField()),
                ('symptome', models.TextField()),
                ('diagnostic', models.TextField()),
                ('traitement', models.TextField()),
                ('notes', models.TextField(blank=True, null=True)),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='consultations', to='patient.patient')),
            ],
        ),
    ]
