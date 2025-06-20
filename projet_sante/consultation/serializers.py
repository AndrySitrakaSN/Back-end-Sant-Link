from rest_framework import serializers
from .models import Consultation

class ConsultationSerializer(serializers.ModelSerializer):
    patient_detail = serializers.SerializerMethodField()

    class Meta:
        model = Consultation
        fields = '__all__'

    def get_patient_detail(self, obj):
        return {
            "id": obj.patient.id,
            "nom_complet": getattr(obj.patient, "nom_complet", str(obj.patient))
        }
