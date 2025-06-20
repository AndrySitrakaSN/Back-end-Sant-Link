from django.urls import path
from .views import ConsultationListCreateView, ConsultationRetrieveUpdateDeleteView
from . import views

urlpatterns = [
    path('liste/', views.liste_consultations, name='liste_consultations'),                  # GET
    path('ajouter/', views.ajouter_consultation, name='ajouter_consultation'),              # POST
    path('modifier/<int:pk>/', views.modifier_consultation, name='modifier_consultation'),  # PUT/PATCH
    path('supprimer/<int:pk>/', views.supprimer_consultation, name='supprimer_consultation'), # DELETE

    path('consultations/', ConsultationListCreateView.as_view(), name='consultation-list-create'),  # test class-based
    path('consultation/<int:pk>/', ConsultationRetrieveUpdateDeleteView.as_view(), name='consultation-detail'),
]

# Lister     GET       http://127.0.0.1:8000/consultation/liste/
# Ajouter    POST      http://127.0.0.1:8000/consultation/ajouter/
# Modifier   PUT/PATCH http://127.0.0.1:8000/consultation/modifier/1/
# Supprimer  DELETE    http://127.0.0.1:8000/consultation/supprimer/1/
