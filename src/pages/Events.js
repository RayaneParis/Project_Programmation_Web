import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import EventFilter from '../components/EventFilter';
import { getEvents } from '../api/eventsApi';
import RoleGuard from "../components/RoleGuard";
import '../styles/Events.css';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const navigate = useNavigate();

    useEffect (() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                const filters = {};
                if (category !== 'All') filters.category = category;
                if (search) filters.search = search;
                const data = await getEvents(filters);
                setEvents(data);
            } catch (error) {
                setError('Impossible to be load events');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [search, category]);


    return (
        <div className="events-page">
            <div className="page-header">
                <h1>Events</h1>
                <span className="page-count">{events.length} results</span>
                <RoleGuard allowedRoles={['admin']}>
                    <button className="btn-primary-event" onClick={() => navigate('/events/create')}> Create Event </button>
                </RoleGuard>
            </div>

            <EventFilter search={search} category={category} onSearchChange={setSearch} onCategoryChange={setCategory} />

            {loading && (
                <div className="loading-grid">
                    {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="skeleton-card" />)}
                </div>
            )}
            {error && <div className="error-box"> {error} </div>}
            {!loading && !error && (
                <div className="events-grid">
                    {events.map((event) => <EventCard key ={event.id} event={event} />)}
                    {events.length === 0 && <p className="no-results">No events found.</p>}
                </div>
            )}
        </div>
    );
};

export default Events;