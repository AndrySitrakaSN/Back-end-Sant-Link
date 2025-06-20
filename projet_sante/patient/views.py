from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Patient
from .serializers import PatientSerializer



from rest_framework import generics
class PatientListCreateView(generics.ListCreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class PatientRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

#________________________________________________________________________________________________Liste
# Liste tous les patients
@api_view(['GET'])
def liste_patients(request):
    patients = Patient.objects.all()
    serializer = PatientSerializer(patients, many=True)
    return Response(serializer.data)
#________________________________________________________________________________________________Ajouter
# Ajouter un patient
@api_view(['POST'])
def ajouter_patient(request):
    serializer = PatientSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#________________________________________________________________________________________________Modifier
# Modifier un patient
@api_view(['PUT', 'PATCH'])
def modifier_patient(request, pk):
    try:
        patient = Patient.objects.get(pk=pk)
    except Patient.DoesNotExist:
        return Response({'error': 'Patient non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = PatientSerializer(patient, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#________________________________________________________________________________________________Supprimer
# Supprimer un patient
@api_view(['DELETE'])
def supprimer_patient(request, pk):
    try:
        patient = Patient.objects.get(pk=pk)
    except Patient.DoesNotExist:
        return Response({'error': 'Patient non trouvé'}, status=status.HTTP_404_NOT_FOUND)

    patient.delete()
    return Response({'message': 'Patient supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)




@api_view(['GET'])
def stats_patients(request):
    actifs = Patient.objects.filter(statut='Actif').count()
    return Response({"actifs": actifs})

    
