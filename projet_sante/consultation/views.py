from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Consultation
from .serializers import ConsultationSerializer

# Vues génériques (class-based views)

class ConsultationListCreateView(generics.ListCreateAPIView):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer

class ConsultationRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer


# Vues fonctionnelles (function-based views) pour CRUD

@api_view(['GET'])
def liste_consultations(request):
    consultations_liste = Consultation.objects.all()
    serializer_liste = ConsultationSerializer(consultations_liste, many=True)
    return Response(serializer_liste.data)

@api_view(['POST'])
def ajouter_consultation(request):
    serializer_ajout = ConsultationSerializer(data=request.data)
    if serializer_ajout.is_valid():
        serializer_ajout.save()
        return Response(serializer_ajout.data, status=status.HTTP_201_CREATED)
    return Response(serializer_ajout.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
def modifier_consultation(request, pk):
    try:
        consultation_update = Consultation.objects.get(pk=pk)
    except Consultation.DoesNotExist:
        return Response({'error': 'Consultation non trouvée'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer_update = ConsultationSerializer(consultation_update, data=request.data, partial=True)
    if serializer_update.is_valid():
        serializer_update.save()
        return Response(serializer_update.data)
    return Response(serializer_update.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def supprimer_consultation(request, pk):
    try:
        consultation_delete = Consultation.objects.get(pk=pk)
    except Consultation.DoesNotExist:
        return Response({'error': 'Consultation non trouvée'}, status=status.HTTP_404_NOT_FOUND)

    consultation_delete.delete()
    return Response({'message': 'Consultation supprimée avec succès'}, status=status.HTTP_204_NO_CONTENT)
