from django.urls import path
from . import views

urlpatterns = [
    path('events/', views.event_list, name='event-list'),
    path('events/<int:pk>/', views.event_detail, name='event-detail'),
    path('events/<int:pk>/register/', views.register_to_event, name='event-register'),
    path('participants/', views.participant_list, name='participant-list'),
    path('participants/<int:pk>/', views.participant_detail, name='participant-detail'),
    path('dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
]
