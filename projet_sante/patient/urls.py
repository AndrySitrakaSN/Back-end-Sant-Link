from django.urls import path
from .views import PatientListCreateView    
from .views import PatientRetrieveUpdateDeleteView  
from .views import stats_patients                                        #test
from . import views

urlpatterns = [
    path('liste/', views.liste_patients, name='liste_patients'),                       # GET
    path('ajouter/', views.ajouter_patient, name='ajouter_patient'),                   # POST
    path('modifier/<int:pk>/', views.modifier_patient, name='modifier_patient'),       # PUT/PATCH
    path('supprimer/<int:pk>/', views.supprimer_patient, name='supprimer_patient'),    # DELETE

    path('patients/', PatientListCreateView.as_view(), name='patient-list-create'),    #test
    path('patient/<int:pk>/', PatientRetrieveUpdateDeleteView.as_view(), name='patient-detail'),

    path('stats/', stats_patients, name='stats-patients'),
]



# Lister     GET       http://127.0.0.1:8000/patient/liste/
# Ajouter    POST      http://127.0.0.1:8000/patient/ajouter/
# Modifier   PUT/PATCH http://127.0.0.1:8000/patient/modifier/1/
# Supprimer  DELETE    http://127.0.0.1:8000/patient/supprimer/1/