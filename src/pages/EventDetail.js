import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
//import ParticipantList from '../components/ParticipantList';
import { getParticipants } from '../api/participantApi';
import { getEvent, registerToEvent, deleteEvent } from '../api/eventsApi';
import { useAuth } from '../store/AuthContext';
import RoleGuard from '../components/RoleGuard';
import '../styles/EventDetail.css';

const CATEGORY_COLORS = { conference: '#667eea', workshop: '#f093fb', seminar: '#f5576c', networking: '#10b981', social: '#f59e0b', sports: '#8b5cf6', other: '#06b6d4'};

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registered, setRegistered] = useState(false);
    const [registerLoading, setRegisterLoading] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [selectedParticipant, setSelectedParticipant] = useState('');
    const [registerMessage, setRegisterMessage] = useState('');
    const [participantMessage, setParticipantMessage] = useState('');
    
    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getEvent(id);
                setEvent(data);
                const key = `registered_${id}_${user?.id}`;
                setRegistered(localStorage.getItem(key) === 'true');
            } catch (error) {
                setError('Event no found.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id, user?.id]);

    
    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const data = await getParticipants();
                setParticipants(data);
            } catch (error) {
                console.error(error)
            }
        };
        fetchParticipants();
    }, []);

    const handleRegisterParticipant = async () => {
        if (!selectedParticipant) return;
        setParticipantMessage('');
        try {
            await registerToEvent(event.id, selectedParticipant);
            const data = await getEvent(id);
            setEvent(data);
            alert('Participant registered successfully!');
        } catch (err) {
            if (err.response?.data?.detail === 'Already registered.') {
                alert('This participant is already registered !');
            } else {
                alert('Error failed during registration');
            }
        }
    };

    const handleRegister = async () => { 
        setRegisterLoading(true);
        try {
            await registerToEvent(event.id);
            setRegistered(true);
            const data = await getEvent(id);
            setEvent(data);
        } catch (error) {
            const detail = error.response?.data?.detail;
            if (detail === 'Already registered.') {
                setRegistered(true);
                setRegisterMessage('You are already registered');
            } else if (detail === 'Event is at full capacity.'){
                alert('this event is full!')
            } else {
                alert(error.message || 'Failed to register to event.');
            }
        } finally {
            setRegisterLoading(false);
        }
    };

    const handleDelete = async () => { 
        if (window.confirm('Are you sure to delete this event ?')) {
            await deleteEvent(id);
            navigate('/events');
        }
     }; 


    if (loading) return <div className="detail-loading"><div className="spinner" /></div>
    if (error) return <div className="detail-error"><p>{error}</p><button onClick={() => navigate('/events')}>Return</button></div>
    if (!event) return null;

    const fill = Math.round((event.participant_count / event.capacity) * 100);
    const color = CATEGORY_COLORS[event.category] || '#f59e0b';

    return (
        <div className="detail-page">
            <div className="detail-top">
                <button className="detail-back" onClick={() => navigate('/events')}>Return</button>
                
                <div className="detail-actions">
                    {user?.role === 'user' && (
                    <button className="btn-register" onClick={handleRegister}
                        disabled={registered || registerLoading || event.participant_count >= event.capacity}>
                        {registered ? 'Registered' : registerLoading ? 'Registering...' : event.participant_count >= event.capacity ? 'Event full' : 'Register'}
                    </button>
                    )}

                    {(user?.role === 'admin' || user?.role === 'editor') && (
                    <>
                        <button className="btn-edit" onClick={() => navigate(`/events/${id}/edit`)}>Edit</button>
                        <button className="btn-delete" onClick={handleDelete}>Delete</button>
                    </>
                    )}
                </div>
            </div>

            {registerMessage && <p className="register-message">{registerMessage}</p>}

            <div className="detail-hero">
                <span className="detail-category" style={{ color, borderColor: color }}>{event.category}</span>
                <h1 className="detail-title">{event.title}</h1>
                <div className="detail-meta">
                    <span>{new Date(event.date).toLocaleDateString('en-EN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span className="meta-sep">./</span>
                    <span>{event.location}</span>
                </div>
            </div>

            <div className="detail-body">
                <div className="detail-main">
                    <div className="detail-section">
                        <h2>Description</h2>
                        <p>{event.description}</p>
                    </div>

                    <RoleGuard allowedRoles={['admin']}>
                        <div className="detail-section">
                            <h2>Register a participant</h2>
                            <div className="register-participant">
                                <select
                                    value={selectedParticipant}
                                    onChange={(e) => setSelectedParticipant(e.target.value)}
                                    className="participant-select"
                                >
                                    <option value="">Select a participant...</option>
                                    {participants.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} - {p.email}
                                        </option>
                                    ))}
                                </select>

                                <button 
                                    className="btn-primary"
                                    onClick={handleRegisterParticipant}
                                    disabled={!selectedParticipant}
                                > Register</button>
                            </div>
                            {participantMessage && (
                                <p style={{
                                    color: participantMessage.includes('successfully') ? '#10b981' : '#f5576c',
                                    fontSize: '0.85rem',
                                    marginTop: '8px'
                                }}>
                                    {participantMessage}
                                </p>
                            )}
                        </div>
                    </RoleGuard>

                    <div className="detail-section">
                        <h2>Registered Participants ({event.participants?.length || 0})</h2>
                    </div>
                </div>
                <aside className="detail-aside">
                    <div className="aside-card">
                        <h3>Capacity</h3>
                        <div className="aside-card">
                            <div className="aside-fill-bar"><div style={{ width: `${fill}`, backgroundColor: color }} /></div>
                            <span>{fill}%</span>
                        </div>
                        <p className="aside-seats">{event.participant_count} / {event.capacity} places</p>
                    </div>
                    <div className="aside-card">
                        <h3>Information</h3>
                        <div className="aside-info-row"><span>Date</span><strong>{new Date(event.date).toLocaleDateString('en-EN')}</strong></div>
                        <div className="aside-info-row"><span>Location</span><strong>{event.location}</strong></div>
                        <div className="aside-info-row"><span>Category</span><strong>{event.category}</strong></div>
                        <div className="aside-info-row"><span>Capacity</span><strong>{event.capacity}</strong></div>
                        <div className="aside-info-row"><span>Status</span><strong>{event.status}</strong></div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default EventDetail;