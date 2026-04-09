import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getParticipant, updateParticipant } from '../api/participantApi';
import '../styles/Form.css';

const EditParticipant = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        name:'',
        email:'',
        phone:'',
    });

    useEffect(() => {
        const fetchParticipant = async () => {
            try {
                const data = await getParticipant(id);
                setForm({
                    name: data.name,
                    email: data.email,
                    phone: data.phone || '',
                });
            } catch (error) {
                setError('Failed to load participant data.');
            } finally {
                setFetchLoading(false);
            }
        };
        fetchParticipant();
    }, [id]);

    const handleChange = (e) => {
            setForm({ ...form, [e.target.name]: e.target.value });
        };
    
    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await updateParticipant(id, form);
            navigate("/participants"); 
        } catch (error) {
            setError(error.message || "Error about a update of participants !");
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) return <div className="form-loading"><div className="spinner" /></div>

    return (
        <div className="form-page">
            <div className="form-header">
                <button className="form-back" onClick={() => navigate('/participants')}>Return to Participants</button>
                <h1>Update Participant</h1>
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

export default EditParticipant;
