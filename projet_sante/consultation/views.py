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
    consultations = Consultation.objects.all()
    serializer = ConsultationSerializer(consultations, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def ajouter_consultation(request):
    serializer = ConsultationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
def modifier_consultation(request, pk):
    try:
        consultation = Consultation.objects.get(pk=pk)
    except Consultation.DoesNotExist:
        return Response({'error': 'Consultation non trouvée'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ConsultationSerializer(consultation, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def supprimer_consultation(request, pk):
    try:
        consultation = Consultation.objects.get(pk=pk)
    except Consultation.DoesNotExist:
        return Response({'error': 'Consultation non trouvée'}, status=status.HTTP_404_NOT_FOUND)

    consultation.delete()
    return Response({'message': 'Consultation supprimée avec succès'}, status=status.HTTP_204_NO_CONTENT)
