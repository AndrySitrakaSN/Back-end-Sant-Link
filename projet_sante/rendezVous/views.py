from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import RendezVous
from .serializers import RendezVousSerializer

from rest_framework import generics

# Classes génériques (optionnel, tu peux utiliser soit les classes soit les fonctions)
class RendezVousListCreateView(generics.ListCreateAPIView):
    queryset = RendezVous.objects.all()
    serializer_class = RendezVousSerializer

class RendezVousRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RendezVous.objects.all()
    serializer_class = RendezVousSerializer

#________________________________________________________________________________________________Liste
@api_view(['GET'])
def liste_rendezvous(request):
    rdvs = RendezVous.objects.all()
    serializer = RendezVousSerializer(rdvs, many=True)
    return Response(serializer.data)

#________________________________________________________________________________________________Ajouter
@api_view(['POST'])
def ajouter_rendezvous(request):
    serializer = RendezVousSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#________________________________________________________________________________________________Modifier
@api_view(['PUT', 'PATCH'])
def modifier_rendezvous(request, pk):
    try:
        rdv = RendezVous.objects.get(pk=pk)
    except RendezVous.DoesNotExist:
        return Response({'error': 'Rendez-vous non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = RendezVousSerializer(rdv, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#________________________________________________________________________________________________Supprimer
@api_view(['DELETE'])
def supprimer_rendezvous(request, pk):
    try:
        rdv = RendezVous.objects.get(pk=pk)
    except RendezVous.DoesNotExist:
        return Response({'error': 'Rendez-vous non trouvé'}, status=status.HTTP_404_NOT_FOUND)

    rdv.delete()
    return Response({'message': 'Rendez-vous supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
