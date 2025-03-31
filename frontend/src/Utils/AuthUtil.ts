import Auth from '../Services/Auth/types/Auth';

const cacheAuthInfo = (auth: Auth) => {
    localStorage.setItem('accessToken', auth.accessToken);
    localStorage.setItem('refreshToken', auth.refreshToken);
};

const clearCache = () => {
    localStorage.clear();
};

const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
};

export { cacheAuthInfo, clearCache, getRefreshToken };
