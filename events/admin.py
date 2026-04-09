from django.contrib import admin
from .models import Event, Participant, Registration


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'status', 'date', 'location', 'capacity', 'participant_count', 'created_by', 'created_at']
    list_filter = ['status', 'category']
    search_fields = ['title', 'location']
    ordering = ['-created_at']


@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'created_at']
    search_fields = ['name', 'email']
    ordering = ['-created_at']


@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ['event', 'participant', 'user', 'registered_at']
    list_filter = ['event']
    ordering = ['-registered_at']
