from django.db import models

class Patient(models.Model):
    GENRE_CHOICES = [
        ('Masculin', 'Masculin'),
        ('Féminin', 'Féminin'),
        ('Autre', 'Autre'),
    ]

    STATUT_CHOICES = [
        ('Actif', 'Actif'),
        ('Inactif', 'Inactif'),
        ('En attente', 'En attente'),
    ]

    # Informations personnelles
    nom_complet = models.CharField(max_length=100)
    date_naissance = models.DateField()
    genre = models.CharField(max_length=10, choices=GENRE_CHOICES)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default="Actif")

    # Coordonnées
    email = models.EmailField(max_length=100, blank=True, null=True)
    telephone = models.CharField(max_length=20, blank=True, default='')
    adresse = models.TextField(blank=True, default='')

    # Informations médicales
    resume_medical = models.TextField(blank=True, default='')

    # Contact d'urgence
    contact_urgence_nom = models.CharField(max_length=100, blank=True, default='')
    contact_urgence_relation = models.CharField(max_length=100, blank=True, default='')
    contact_urgence_telephone = models.CharField(max_length=20, blank=True, default='')

    # Assurance
    nom_assurance = models.CharField(max_length=100, blank=True, default='')
    numero_police = models.CharField(max_length=50, blank=True, default='')

    def __str__(self):
        return self.nom_complet
