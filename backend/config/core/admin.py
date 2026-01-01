from django.contrib import admin
from .models import HumidityRecord, PumpState, Device, ThresholdConfig

# Register your models here.
admin.site.register(HumidityRecord)
admin.site.register(PumpState)
admin.site.register(Device)
admin.site.register(ThresholdConfig)
