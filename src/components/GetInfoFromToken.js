import axios from "axios";

export default async function GetInfoFromToken () {
    if (!localStorage.getItem('authToken')) return;
    const response = await axios.get('http://localhost:5000/api/userInfo', {
        headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    if (response.data.message === 'jwt invalid') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('id');
        localStorage.removeItem('email');
        localStorage.removeItem('type');
    } else {
        localStorage.setItem('id', response.data.id);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('type', response.data.type);
    };
};