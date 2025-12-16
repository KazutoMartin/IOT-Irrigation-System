# core/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.conf import settings
from .models import Device

class DeviceConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for ESP32 device"""
    
    async def connect(self):
        # Verify token from query string
        token = self.scope['query_string'].decode().split('token=')[-1]
        
        if token != settings.DEVICE_TOKEN:
            await self.close()
            return
        
        device = await self.get_device(token)
        if not device:
            await self.close()
            return
        
        self.device_id = device.id
        self.device_group = f"device_{device.id}"
        
        await self.channel_layer.group_add(
            self.device_group,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        if hasattr(self, 'device_group'):
            await self.channel_layer.group_discard(
                self.device_group,
                self.channel_name
            )
    
    async def pump_command(self, event):
        """Send pump command to ESP32"""
        await self.send(text_data=json.dumps({
            'type': 'command',
            'pump_on': event['pump_on']
        }))
    
    async def config_update(self, event):
        """Send threshold config update to ESP32"""
        await self.send(text_data=json.dumps({
            'type': 'config',
            'min_humidity': event['min_humidity'],
            'max_humidity': event['max_humidity']
        }))
    
    @database_sync_to_async
    def get_device(self, token):
        try:
            return Device.objects.get(device_token=token)
        except Device.DoesNotExist:
            return None


class FrontendConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for frontend clients"""
    
    async def connect(self):
        self.group_name = "frontend"
        
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
    
    async def telemetry_update(self, event):
        """Send telemetry update to frontend"""
        await self.send(text_data=json.dumps({
            'type': 'telemetry',
            'humidity': event['humidity'],
            'pump_on': event['pump_on'],
            'timestamp': event['timestamp']
        }))
