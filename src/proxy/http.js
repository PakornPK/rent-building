const API_URL = import.meta.env.VITE_API_URL;

async function request(url, options = {}) {
    const response = await fetch(`${API_URL}/${url}`, {
        method: options.method || 'GET',
        headers: options.headers || {},
        body: options.body ? JSON.stringify(options.body) : undefined,
        credentials: options.credentials || 'omit',
    });
    if (response.ok) {
        return response;
    } else {
        throw new Error(`Request to ${url} failed.`);
    }
}

export async function Post({ url, body, headers = { 'Content-Type': 'application/json' } }) {
    return await request(url, { method: 'POST', body, headers });
}

export async function Get({ url, headers = { 'Content-Type': 'application/json' } }) {
    return await request(url, { method: 'GET', headers });
}

export async function Put({ url, body, headers = { 'Content-Type': 'application/json' } }) {
    return await request(url, { method: 'PUT', body, headers });
}

export async function Patch({ url, body, headers = { 'Content-Type': 'application/json' } }) {
    return await request(url, { method: 'PATCH', body, headers });
}

export async function Delete({ url, body, headers = { 'Content-Type': 'application/json' } }) {
    return await request(url, { method: 'DELETE', headers, body });
}