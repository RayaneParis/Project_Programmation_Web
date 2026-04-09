from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from .models import Event, Participant, Registration
from .serializers import (
    EventListSerializer,
    EventDetailSerializer,
    EventCreateSerializer,
    ParticipantSerializer,
    RegistrationSerializer,
)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticatedOrReadOnly])
def event_list(request):
    if request.method == 'GET':
        events = Event.objects.all().order_by('-created_at')

        category = request.query_params.get('category')
        status_filter = request.query_params.get('status')
        date_filter = request.query_params.get('date')
        search = request.query_params.get('search')

        if category:
            events = events.filter(category=category)
        if status_filter:
            events = events.filter(status=status_filter)
        if date_filter:
            events = events.filter(date__date=date_filter)
        if search:
            events = events.filter(title__icontains=search)

        serializer = EventListSerializer(events, many=True)
        return Response(serializer.data)

    serializer = EventCreateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(created_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticatedOrReadOnly])
def event_detail(request, pk):
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(EventDetailSerializer(event).data)

    if request.method in ('PUT', 'PATCH'):
        serializer = EventCreateSerializer(event, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(EventDetailSerializer(event).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    event.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_to_event(request, pk):
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    if event.capacity > 0 and event.participant_count >= event.capacity:
        return Response({'detail': 'Event is at full capacity.'}, status=status.HTTP_400_BAD_REQUEST)

    participant_id = request.data.get('participant_id')
    participant = None

    if participant_id:
        try:
            participant = Participant.objects.get(pk=participant_id)
        except Participant.DoesNotExist:
            return Response({'detail': 'Participant not found.'}, status=status.HTTP_404_NOT_FOUND)
        if Registration.objects.filter(event=event, participant=participant).exists():
            return Response({'detail': 'Already registered.'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        if Registration.objects.filter(event=event, user=request.user).exists():
            return Response({'detail': 'Already registered.'}, status=status.HTTP_400_BAD_REQUEST)

    registration = Registration.objects.create(
        event=event,
        participant=participant,
        user=None if participant_id else request.user,
    )
    return Response(RegistrationSerializer(registration).data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticatedOrReadOnly])
def participant_list(request):
    if request.method == 'GET':
        participants = Participant.objects.all().order_by('-created_at')
        return Response(ParticipantSerializer(participants, many=True).data)

    serializer = ParticipantSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticatedOrReadOnly])
def participant_detail(request, pk):
    try:
        participant = Participant.objects.get(pk=pk)
    except Participant.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(ParticipantSerializer(participant).data)

    if request.method in ('PUT', 'PATCH'):
        serializer = ParticipantSerializer(participant, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    participant.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    total_events = Event.objects.count()
    published_events = Event.objects.filter(status='published').count()
    total_participants = Participant.objects.count()
    total_registrations = Registration.objects.count()

    recent_events = EventListSerializer(
        Event.objects.order_by('-created_at')[:5],
        many=True,
    ).data

    return Response({
        'total_events': total_events,
        'published_events': published_events,
        'total_participants': total_participants,
        'total_registrations': total_registrations,
        'recent_events': recent_events,
    })
