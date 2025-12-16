# core/routing.py
from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/device/', consumers.DeviceConsumer.as_asgi()),
    path('ws/frontend/', consumers.FrontendConsumer.as_asgi()),
]
