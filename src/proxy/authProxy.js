import { Post } from './http';

async function login({ email, password }) {
    return Post({ url: 'auth/login', body: { email, password } });
}

async function logout() {
    return Post({ url: 'auth/logout', credentials: 'include' });
}

async function refreshToken() {
    return Post({ url: 'auth/refresh', credentials: 'include' });
}

export default {
    login,
    logout,
    refreshToken,
}