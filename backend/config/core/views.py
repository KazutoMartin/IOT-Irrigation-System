# core/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.conf import settings
from datetime import timedelta
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Device, HumidityRecord, PumpState, ThresholdConfig
from .serializers import TelemetrySerializer, HumidityRecordSerializer, ThresholdSerializer

def verify_device_token(request):
    """Verify device token from Authorization header"""
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(' ')[1]
    if token != settings.DEVICE_TOKEN:
        return None
    device, _ = Device.objects.get_or_create(
        device_token=token,
        defaults={'name': 'ESP32 Device'}
    )
    return device

def evaluate_pump_logic(device, humidity):
    """Evaluate and execute pump control logic"""
    config = ThresholdConfig.get_config()
    pump_state, _ = PumpState.objects.get_or_create(device=device)
    
    desired_state = None
    
    if humidity < config.min_humidity:
        desired_state = True
    elif humidity > config.max_humidity:
        desired_state = False
    
    if desired_state is not None and pump_state.is_on != desired_state:
        pump_state.is_on = desired_state
        pump_state.save()
        
        # Send command to ESP32 via WebSocket
        send_pump_command(device, desired_state)
        
        return desired_state
    
    return pump_state.is_on

def send_pump_command(device, pump_on):
    """Send pump command to ESP32 via WebSocket"""
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"device_{device.id}",
        {
            "type": "pump_command",
            "pump_on": pump_on
        }
    )

def broadcast_telemetry(humidity, pump_on, timestamp):
    """Broadcast telemetry to all connected frontend clients"""
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "frontend",
        {
            "type": "telemetry_update",
            "humidity": humidity,
            "pump_on": pump_on,
            "timestamp": timestamp
        }
    )

@api_view(['POST'])
def telemetry(request):
    """Receive telemetry from ESP32"""
    device = verify_device_token(request)
    if not device:
        return Response({'error': 'Invalid device token'}, status=status.HTTP_401_UNAUTHORIZED)
    
    serializer = TelemetrySerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    
    # Update device status
    device.update_last_seen()
    
    # Store humidity record
    HumidityRecord.objects.create(
        device=device,
        humidity=data['humidity']
    )
    
    # Evaluate pump logic
    pump_on = evaluate_pump_logic(device, data['humidity'])
    
    # Broadcast to frontend
    broadcast_telemetry(data['humidity'], pump_on, data['timestamp'])
    
    return Response({'status': 'ok', 'pump_on': pump_on})

@api_view(['GET'])
def recent_humidity(request):
    """Get recent humidity data for graphing"""
    seconds = int(request.GET.get('seconds', 60))
    time_threshold = timezone.now() - timedelta(seconds=seconds)
    
    records = HumidityRecord.objects.filter(
        created_at__gte=time_threshold
    ).order_by('created_at')
    
    serializer = HumidityRecordSerializer(records, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_status(request):
    """Get current system status"""
    try:
        device = Device.objects.first()
        if not device:
            return Response({
                'humidity': None,
                'pump_on': False,
                'min_threshold': 20,
                'max_threshold': 40,
                'device_online': False
            })
        
        latest_record = HumidityRecord.objects.filter(device=device).first()
        pump_state = PumpState.objects.filter(device=device).first()
        config = ThresholdConfig.get_config()
        
        # Check if device is online (last seen within 5 seconds)
        is_online = False
        if device.last_seen:
            is_online = (timezone.now() - device.last_seen).total_seconds() < 5
        
        return Response({
            'humidity': latest_record.humidity if latest_record else None,
            'pump_on': pump_state.is_on if pump_state else False,
            'min_threshold': config.min_humidity,
            'max_threshold': config.max_humidity,
            'device_online': is_online
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def update_threshold(request):
    """Update humidity thresholds"""
    config = ThresholdConfig.get_config()
    serializer = ThresholdSerializer(config, data=request.data, partial=True)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    serializer.save()
    
    # Broadcast new config to ESP32
    channel_layer = get_channel_layer()
    device = Device.objects.first()
    if device:
        async_to_sync(channel_layer.group_send)(
            f"device_{device.id}",
            {
                "type": "config_update",
                "min_humidity": serializer.data['min_humidity'],
                "max_humidity": serializer.data['max_humidity']
            }
        )
    
    return Response(serializer.data)
