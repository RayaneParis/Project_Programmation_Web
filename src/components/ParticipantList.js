import React from 'react';
import RoleGuard from './RoleGuard';
import '../styles/Participants.css';

const ParticipantList = ({ participants, onEdit, onDelete }) => {
    if (!participants || participants.length === 0) {
        return <p className="no-participants">No One for a moment ?</p>;
    }
    return (
        <div className="participant-list">
            {participants.map((p) => (
                <div key={p.id} className="participant-item">
                    <div className="participant-avatar">{p.name.charAt(0).toUpperCase()}</div>
                    <div className="participant-info">
                        <span className="participant-name">{p.name}</span>
                        <span className="participant-email">{p.email}</span>
                    </div>
                    {p.registered_at && (
                        <span className="participant-date">{new Date(p.registered_at).toLocaleDateString('en-EN')}</span>
                    )}
                    {onEdit && onDelete && (
                        <RoleGuard allowedRoles={['admin']}>
                            <div className="participant-actions">
                                <button className="btn-edit-sm" onClick={() => onEdit(p.id)}>Edit</button>
                                <button className="btn-delete-sm" onClick={() => onDelete(p.id)}>Delete</button>
                            </div>
                        </RoleGuard>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ParticipantList;