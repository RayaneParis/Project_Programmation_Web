import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../store/AuthContext';
import { getEvents } from '../api/eventsApi';
import { getParticipants } from '../api/participantApi';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [eventsData, participantsData] = await Promise.all([
                    getEvents(),
                    getParticipants(),
                ]);
                setEvents(eventsData);
                setParticipants(participantsData)
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const totalCapacity = events.reduce((sum, e) => sum + e.capacity,0);
    const totalFilled = events.reduce((sum, e) => sum + e.participant_count,0);
    const fillRate = totalCapacity ? Math.round((totalFilled / totalCapacity) * 100) : 0;

    const categories = events.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + 1;
        return acc;
        
    }, {});

    const upcoming = events 
        .filter((e) => new Date(e.date) > new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);

    if (loading) return <div className="loading-center"><div className="spinner"/></div>;

    return (
        <div className="dashboard-page">
            <div className="dashboard-welcome">
                <h1>Hi , <span>{user?.name || 'Admin'}</span></h1>
                <p>Here is the resume activity</p>
            </div>

            <div className="dashboard-welcome-date">
                <strong>{new Date().toLocaleDateString('en-EN', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>
                {new Date().getFullYear()}
            </div>
        
            <div className="dashboard-stats">
                <div className="stat-card">
                    <span className="stat-value">{events.length}</span>
                    <span className="stat-label">Evènements</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{participants.length}</span>
                    <span className="stat-label">Participants</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{fillRate}%</span>
                    <span className="stat-label">Taux de remplissage</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{Object.keys(categories).length}%</span>
                    <span className="stat-label">Category</span>
                </div>
            </div>

            <div className="dashboard-body">
                <div className="dashboard-section">
                    <h2>Imcoming events</h2>
                    <div className="upcoming-list">
                        {upcoming.map((e) => (
                            <div key={e.id} className="upcoming-item" onClick={() => navigate(`/events/${e.id}`)}>
                                <div className="upcoming-date">
                                    <strong>{new Date(e.date).toLocaleDateString('en-EN', { day: 'numeric', month: 'short' })}</strong>
                                </div>
                                    <div className="upcoming-info">
                                        <span className="upcoming-title">{e.title}</span>
                                        <span className="upcoming-location">{e.location}</span>
                                    </div>
                                    <span className="upcoming-count">{e.participants_count} inscrits</span>
                                </div>
                        ))}
                    </div>
                </div>

                <div className="dashboard-section">
                    <h2>Par catégories</h2>
                    <div className="categories-list">
                        {Object.entries(categories).map(([cat, count]) => (
                        <div key={cat} className="category-row">
                            <span className="category-name">{cat}</span>
                            <div className="category-bar-track">
                                <div
                                    className="category-bar-fill"
                                    style={{ width: `${(count /events.length) * 100}%`}}
                                />
                            </div>
                            <span className="category-count">{count}</span>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>    
    );
};

export default Dashboard;