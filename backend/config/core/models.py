# core/models.py
from django.db import models
from django.utils import timezone

class Device(models.Model):
    name = models.CharField(max_length=100, default="ESP32 Device")
    device_token = models.CharField(max_length=255, unique=True)
    is_online = models.BooleanField(default=False)
    last_seen = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.name
    
    def update_last_seen(self):
        self.last_seen = timezone.now()
        self.is_online = True
        self.save(update_fields=['last_seen', 'is_online'])


class HumidityRecord(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='humidity_records')
    humidity = models.IntegerField()  # 1-100
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        return f"{self.device.name} - {self.humidity}% at {self.created_at}"


class PumpState(models.Model):
    device = models.OneToOneField(Device, on_delete=models.CASCADE, related_name='pump_state')
    is_on = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.device.name} - Pump {'ON' if self.is_on else 'OFF'}"


class ThresholdConfig(models.Model):
    min_humidity = models.IntegerField(default=20)
    max_humidity = models.IntegerField(default=40)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Threshold Configurations"
    
    def __str__(self):
        return f"Min: {self.min_humidity}% - Max: {self.max_humidity}%"
    
    @classmethod
    def get_config(cls):
        config, _ = cls.objects.get_or_create(pk=1)
        return config
