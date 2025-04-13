import GetInfoFromToken from "../components/GetInfoFromToken";

export const isAuthenticated = () => {
    GetInfoFromToken();
    const token = localStorage.getItem('authToken');
    return Boolean(token);
};