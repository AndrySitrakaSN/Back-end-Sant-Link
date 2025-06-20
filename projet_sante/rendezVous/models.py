from django.db import models
from patient.models import Patient  # Assure-toi que l'app 'patient' est bien nommée ainsi

class RendezVous(models.Model):
    MEDECIN_CHOICES = [
        ('Rakotomalala', 'Rakotomalala'),
        ('Mandria', 'Mandria'),
        ('Robin', 'Robin'),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='rendezvous')
    date = models.DateField()
    heure = models.TimeField()
    motif = models.CharField(max_length=255)
    medecin = models.CharField(max_length=50, choices=MEDECIN_CHOICES, default='Rakotomalala')
    notes = models.TextField(blank=True, default='')

    def __str__(self):
        return f"RDV de {self.patient.nom_complet} avec Dr. {self.medecin} le {self.date} à {self.heure}"
