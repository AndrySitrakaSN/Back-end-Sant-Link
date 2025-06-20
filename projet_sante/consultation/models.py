from django.db import models
from patient.models import Patient  # ou adaptez selon votre structure

class Consultation(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='consultations')
    date_consultation = models.DateField()
    medecin = models.CharField(max_length=100, default="Rakotomalala")
    motif = models.TextField()
    symptome = models.TextField()
    diagnostic = models.TextField()
    traitement = models.TextField()
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Consultation de {self.patient.nom_complet} - {self.date_consultation}"
