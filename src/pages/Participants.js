import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import ParticipantList from '../components/ParticipantList';
import RoleGuard  from '../components/RoleGuard';
import { getParticipants, deleteParticipant } from '../api/participantApi';
import '../styles/Participants.css';

const Participants = () => {
    const { user } = useAuth();
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchParticipants = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getParticipants();
                setParticipants(data);
            } catch (err) {
                setError('Impossible to load participants');
            } finally {
                setLoading(false);
            }
        };
        fetchParticipants();
    }, []);


    if (user?.role === 'user') {
        return (
            <div className="participants-page">
                <div className="participants-header">
                    <h1>Participants</h1>
                </div>
                <div className="access-denied">
                    <p>Access reserved for administrators.</p>
                    <button className="btn-secondary-participants" onClick={() => navigate('/events')}>Back to Events</button>
                </div>
            </div>
        );
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this participant?')) {
            await deleteParticipant(id);
            setParticipants(participants.filter((p) => p.id !== id));
        }
    };

    const filtered = participants.filter(
        (p) => p.name.toLowerCase().includes(search.toLowerCase()) ||
               p.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="participants-page">
            <div className="participants-header">
                <h1>Participants</h1>
                <span className="page-count">{filtered.length} participants</span>
                <RoleGuard allowedRoles={['admin']}>
                    <button className="btn-primary-participant" onClick={() => navigate('/participants/create')}>
                        Add Participant
                    </button>
                </RoleGuard>
            </div>


            <input type="text" className="participants-search" placeholder="Search by name or email..."
                value={search} onChange={(e) => setSearch(e.target.value)} />


            {loading && <div className="loading-center"><div className="spinner" /></div>}
            {error && <div className="error-box">{error}</div>}
            {!loading && !error && <ParticipantList participants={filtered} onEdit={(id) => navigate(`/participants/${id}/edit`)} onDelete={handleDelete} /> }
        </div>
    );
};

export default Participants;