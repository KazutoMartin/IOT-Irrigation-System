from django.contrib import admin
from .models import HumidityRecord, PumpState

# Register your models here.
admin.site.register(HumidityRecord)
admin.site.register(PumpState)
