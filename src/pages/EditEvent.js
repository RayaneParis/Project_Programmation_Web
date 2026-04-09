import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEvent, updateEvent } from '../api/eventsApi';
import '../styles/Form.css';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState(null);
    const[form, setForm] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        category: 'Tech',
        capacity: '',
        status: 'upcoming',
    });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await getEvent(id);
                setForm({
                    title: data.title,
                    description: data.description,
                    date: data.date.split('T')[0],
                    location:data.location,
                    category: data.category,
                    capacity: data.capacity,
                    status: data.status || 'upcoming',
                });
            } catch (error) {
                setError('Failed to load ebent data.');
            } finally {
                setFetchLoading(false);
            }
            
        };
        fetchEvent();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            setError(null);
            try {
                await updateEvent(id, form);
                navigate(`/events/${id}`); 
            } catch (error) {
                setError(error.message || "Failed to update event.");
            } finally {
                setLoading(false);
            }
    };

    if (fetchLoading) return <div className="loading-center"><div className="spinner"></div></div>;

    return (
        <div className="form-page">
            <div className="form-header">
                <button className="form-back" onClick={() => navigate(`/events/${id}`)}>Return</button>

                <h1>Edit Event</h1>
            </div>

            {error && <div className="error-box">{error}</div>}

            <form onSubmit={onSubmit} className="form-card">
                <div className="form-group">
                    <label>Title</label>
                    <input
                        id="text"
                        type="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Title of event.."
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Description of event.."
                        rows={4}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Place</label>
                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="Place"
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                   <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={form.category} onChange={handleChange}>
                            <option value="workshop">Workshop</option>
                            <option value="conference">Conference</option>
                            <option value="meetup">Meetup</option>
                            <option value="seminar">Seminar</option>
                            <option value="networking">Networking</option>
                            <option value="social">Social</option>
                            <option value="sports">Sports</option>
                            <option value="option">Option</option>
                        </select>
                    </div>  
                    <div className="form-group">
                        <label>Capacity</label>
                        <input
                            type="number"
                            name="capacity"
                            value={form.capacity}
                            onChange={handleChange}
                            placeholder="Number of places"
                            min="1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Statut</label>
                        <select name="status" value={form.status} onChange={handleChange}>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={() => navigate(`/events/${id}`)}> Cancel </button>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? <span className="btn-spinner" /> : 'Update Event'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditEvent;