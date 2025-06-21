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
    rdvs_liste = RendezVous.objects.all()
    serializer_liste = RendezVousSerializer(rdvs_liste, many=True)
    return Response(serializer_liste.data)

#________________________________________________________________________________________________Ajouter
@api_view(['POST'])
def ajouter_rendezvous(request):
    serializer_ajout = RendezVousSerializer(data=request.data)
    if serializer_ajout.is_valid():
        serializer_ajout.save()
        return Response(serializer_ajout.data, status=status.HTTP_201_CREATED)
    return Response(serializer_ajout.errors, status=status.HTTP_400_BAD_REQUEST)

#________________________________________________________________________________________________Modifier
@api_view(['PUT', 'PATCH'])
def modifier_rendezvous(request, pk):
    try:
        rdv_update = RendezVous.objects.get(pk=pk)
    except RendezVous.DoesNotExist:
        return Response({'error': 'Rendez-vous non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer_update = RendezVousSerializer(rdv_update, data=request.data, partial=True)
    if serializer_update.is_valid():
        serializer_update.save()
        return Response(serializer_update.data)
    return Response(serializer_update.errors, status=status.HTTP_400_BAD_REQUEST)

#________________________________________________________________________________________________Supprimer
@api_view(['DELETE'])
def supprimer_rendezvous(request, pk):
    try:
        rdv_delete = RendezVous.objects.get(pk=pk)
    except RendezVous.DoesNotExist:
        return Response({'error': 'Rendez-vous non trouvé'}, status=status.HTTP_404_NOT_FOUND)

    rdv_delete.delete()
    return Response({'message': 'Rendez-vous supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
