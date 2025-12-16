# core/serializers.py
from rest_framework import serializers
from .models import HumidityRecord, ThresholdConfig

class TelemetrySerializer(serializers.Serializer):
    humidity = serializers.IntegerField(min_value=1, max_value=100)
    pump_on = serializers.BooleanField()
    timestamp = serializers.IntegerField()

class HumidityRecordSerializer(serializers.ModelSerializer):
    timestamp = serializers.SerializerMethodField()
    
    class Meta:
        model = HumidityRecord
        fields = ['humidity', 'timestamp']
    
    def get_timestamp(self, obj):
        return int(obj.created_at.timestamp())

class ThresholdSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThresholdConfig
        fields = ['min_humidity', 'max_humidity']
    
    def validate(self, data):
        if data['min_humidity'] >= data['max_humidity']:
            raise serializers.ValidationError("min_humidity must be less than max_humidity")
        return data
