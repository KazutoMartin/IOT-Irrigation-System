import os
import django

from django.core.asgi import get_asgi_application

# Set the Django settings module BEFORE any Django imports
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Initialize Django BEFORE importing anything that uses Django
django.setup()

# Now get the ASGI application
django_asgi_app = get_asgi_application()

# Import Channels components AFTER Django is set up
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator

# Import your routing (if you have WebSocket consumers)
try:
	from irrigation_api.routing import websocket_urlpatterns
except ImportError:
	websocket_urlpatterns = []

# Configure the ASGI application
application = ProtocolTypeRouter({
	"http": django_asgi_app,
	"websocket": AllowedHostsOriginValidator(
	AuthMiddlewareStack(
		URLRouter(websocket_urlpatterns)
	)
	),
})

