import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createParticipant } from '../api/participantApi';
import '../styles/Form.css';

const CreateParticipant = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        name:'',
        email:'',
        phone:'',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await createParticipant(form);
            navigate("/participants"); 
        } catch (error) {
            setError(error.message || "error about a create of participants !");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page">
            <div className="form-header">
                <button className="form-back" onClick={() => navigate('/participants')}>Return to Participants</button>
                <h1>Create Participant</h1>
            </div>

            {error && <div className="error-box">{error}</div>}

            <form onSubmit={onSubmit} className="form-card">
                <div className="form-group">
                    <label>Name</label>
                    <input 
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Jean Dupont"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input 
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="jean@example.com"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Phone</label>
                    <input 
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+33 6 01 16 28 78"
                        required
                    />
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={() => navigate('/participants')}>Cancel</button>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? <span className="btn-spinner" /> : 'Add'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateParticipant;