import Auth from '../services/auth-service/types/auth';

const cacheAuthInfo = (auth: Auth) => {
    localStorage.setItem('accessToken', auth.accessToken);
    localStorage.setItem('refreshToken', auth.refreshToken);
    localStorage.setItem('userId', auth.id);
    document.dispatchEvent(new CustomEvent('loginEvent', { detail: true }));
};

const clearCache = () => {
    localStorage.clear();
    document.dispatchEvent(new CustomEvent('loginEvent', { detail: false }));
};

const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
};

export { cacheAuthInfo, clearCache, getRefreshToken };
