import api from './index';

export const getEvents = async (filters = {}) => {
    const res = await api.get('/events/',  { params: filters});
    return res.data;
};

export const getEvent = async (id) => {
    const res = await api.get(`/events/${id}/`);
    return res.data;
};

export const createEvent = async (data) => {
    const res = await api.post('/events/', data);
    return res.data;
};

export const updateEvent = async (id, data) => {
    const res = await api.patch(`/events/${id}/`, data);
    return res.data;
};

export const deleteEvent = async (id) => {
    await api.delete(`/events/${id}/`);
};

export const registerToEvent = async (eventId, participantId = null ) => {
    const body = participantId ? { participant_id: participantId } : {};
    const res = await api.post(`/events/${eventId}/register/`, body);
    return res.data;
};