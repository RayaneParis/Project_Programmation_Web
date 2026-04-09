import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Events.css';

const CATEGORY_COLORS = { conference: '#667eea', workshop: '#f093fb', seminar: '#f5576c', networking: '#10b981', social: '#f59e0b', sports: '#8b5cf6', other: '#06b6d4'};

const EventCard =  ({ event }) => {
    const navigate = useNavigate();
    const fill = Math.round((event.participant_count / event.capacity) * 100);
    const color = CATEGORY_COLORS[event.category] || '#f59e0b';

    return (
        <div className="event-card" onClick={() => navigate(`/events/${event.id}`)}>
            <div className="event-card-header">
                <span className="event-category" style={{ color, borderColor: color }}>{event.category}</span>
                <span className="event-date">{new Date(event.date).toLocaleDateString('en-EN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <h3 className="event-title">{event.title}</h3>
            <p className="event-location">{event.location}</p>
            <p className="event-description">{event.description}</p>
            <div className="event-card-footer">
                <div className="event-till-bar">
                    <div className="event-till-track">
                        <div className="event-fill-progress" style={{ width: `${fill}%`, backgroundColor: color }} />
                    </div>
                    <span className="event-fill-label">{event.participant_count} / {event.capacity} </span>
                </div>
            </div>
        </div>  
    );
};

export default EventCard;