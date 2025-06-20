from django.urls import path
from .views import RendezVousListCreateView, RendezVousRetrieveUpdateDeleteView
from . import views

urlpatterns = [
    path('liste/', views.liste_rendezvous, name='liste_rendezvous'),                      # GET
    path('ajouter/', views.ajouter_rendezvous, name='ajouter_rendezvous'),                # POST
    path('modifier/<int:pk>/', views.modifier_rendezvous, name='modifier_rendezvous'),    # PUT/PATCH
    path('supprimer/<int:pk>/', views.supprimer_rendezvous, name='supprimer_rendezvous'), # DELETE

    path('rendezvous/', RendezVousListCreateView.as_view(), name='rendezvous-list-create'),  # Liste + Create via generic view
    path('rendezvous/<int:pk>/', RendezVousRetrieveUpdateDeleteView.as_view(), name='rendezvous-detail'), # Récupérer/Modifier/Supprimer via generic view
]

# Lister     GET       http://127.0.0.1:8000/rendezvous/liste/
# Ajouter    POST      http://127.0.0.1:8000/rendezvous/ajouter/
# Modifier   PUT/PATCH http://127.0.0.1:8000/rendezvous/modifier/1/
# Supprimer  DELETE    http://127.0.0.1:8000/rendezvous/supprimer/1/
