from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('patient/', include('patient.urls')),  
    path('rendezVous/', include('rendezVous.urls')),  
    path('consultation/', include('consultation.urls')),
]
