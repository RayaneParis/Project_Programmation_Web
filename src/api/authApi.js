import api from './index';

export const loginApi = async (email, password) => {
    const res = await api.post('/accounts/login/', { email, password});
    return {
        token: res.data.token,
        user: res.data.user,
    }
}

export const registerApi = async (email, password, firstName, lastName, birthDate) => {
    console.log('Data sent to API:', { email, password, firstName, lastName, birthDate });
    const res = await api.post('/accounts/register/', {
        email, 
        password, 
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
    });
    return res.data;
}