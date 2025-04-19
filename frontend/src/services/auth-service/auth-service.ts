import Auth from './types/auth';
import Credentials from './types/credentials';
import { abortablePostRequest } from '../abortable-request';

const signIn = (credentials: Credentials) =>
    abortablePostRequest<Auth>('users/login', { ...credentials });

const signUp = (credentials: Credentials) =>
    abortablePostRequest<Auth>('users', { ...credentials });

const refresh = (refreshToken: string) =>
    abortablePostRequest<Auth>('users/refresh', { refreshToken });

const signOut = (refreshToken: string) =>
    abortablePostRequest<Auth>('users/logout', { refreshToken });

export default { signIn, signUp, refresh, logout: signOut };
