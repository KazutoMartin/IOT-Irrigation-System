# config/urls.py
from django.contrib import admin
from django.urls import path
from core import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/telemetry/', views.telemetry),
    path('api/recent-humidity/', views.recent_humidity),
    path('api/status/', views.get_status),
    path('api/threshold/', views.update_threshold),
]
