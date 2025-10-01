import { Post } from './http';

async function login({ email, password }) {
    return Post({ url: 'api/auth/login', body: { email, password } });
}

async function logout() {
    return Post({ url: 'api/auth/logout', credentials: 'include' });
}

async function refreshToken() {
    return Post({ url: 'api/auth/refresh', credentials: 'include' });
}

export default {
    login,
    logout,
    refreshToken,
}