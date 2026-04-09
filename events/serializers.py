from rest_framework import serializers
from .models import Event, Participant, Registration


class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = ['id', 'name', 'email', 'phone', 'created_at']


class RegistrationSerializer(serializers.ModelSerializer):
    participant = ParticipantSerializer(read_only=True)
    participant_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Registration
        fields = ['id', 'event', 'participant', 'participant_id', 'user', 'registered_at']
        read_only_fields = ['id', 'registered_at']


class EventListSerializer(serializers.ModelSerializer):
    participant_count = serializers.ReadOnlyField()

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 'location', 'category', 'capacity', 'status', 'participant_count', 'created_at']


class EventDetailSerializer(serializers.ModelSerializer):
    participant_count = serializers.ReadOnlyField()
    participants = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 'location', 'category', 'capacity', 'status', 'participant_count', 'participants', 'created_by', 'created_at']
        read_only_fields = ['id', 'created_by', 'created_at']

    def get_participants(self, obj):
        registrations = obj.registrations.all()
        participants = [r.participant for r in registrations if r.participant is not None]
        return ParticipantSerializer(participants, many=True).data


class EventCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['title', 'description', 'date', 'location', 'category', 'capacity', 'status']
