import api from './index';

export const getParticipants = async () => {
    const res = await api.get('/participants/');
    return res.data;
};

export const getParticipant = async (id) => {
    const res = await api.get(`/participants/${id}/`);
    return res.data;
};

export const createParticipant = async (data) => {
    const res = await api.post('/participants/', data);
    return res.data;
};

export const updateParticipant = async (id, data) => {
    const res = await api.patch(`/participants/${id}/`, data);
    return res.data;
};

export const deleteParticipant = async (id) => {
    await api.delete(`/participants/${id}/`);
};
