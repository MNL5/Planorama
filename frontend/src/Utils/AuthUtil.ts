import Auth from '../Services/Auth/types/Auth';

const cacheAuthInfo = (auth: Auth) => {
    localStorage.setItem('accessToken', auth.accessToken);
    localStorage.setItem('refreshToken', auth.refreshToken);
    localStorage.setItem("id", auth.id);
    document.dispatchEvent(new CustomEvent('loginEvent', {detail: true}));
};

const clearCache = () => {
    localStorage.clear();
    document.dispatchEvent(new CustomEvent('loginEvent', {detail: false}));
};

const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
};

export { cacheAuthInfo, clearCache, getRefreshToken };
