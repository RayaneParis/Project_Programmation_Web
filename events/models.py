from django.db import models
from django.conf import settings


class Event(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    CATEGORY_CHOICES = [
        ('conference', 'Conference'),
        ('workshop', 'Workshop'),
        ('seminar', 'Seminar'),
        ('networking', 'Networking'),
        ('social', 'Social'),
        ('sports', 'Sports'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    date = models.DateTimeField()
    location = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    capacity = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='events',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def participant_count(self):
        return self.registrations.count()

    def __str__(self):
        return self.title


class Participant(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.name} <{self.email}>'


class Registration(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE, related_name='registrations', null=True, blank=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='registrations',
    )
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['event', 'participant'],
                condition=models.Q(participant__isnull=False),
                name='unique_event_participant',
            ),
            models.UniqueConstraint(
                fields=['event', 'user'],
                condition=models.Q(user__isnull=False),
                name='unique_event_user',
            ),
        ]

    def __str__(self):
        return f'{self.event} – {self.participant or self.user}'
