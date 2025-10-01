import { Post, Get, Put, Delete } from './http';

async function getUsers(currentPage, pageSize,sort) {
    return Get({ url: `api/users?page=${currentPage}&page_size=${pageSize}&sort=${sort}`, headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` } });
}

async function getUser(id) {
    return Get({ url: `api/users/${id}`, headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` } });
}

async function createUser(user) {
    return Post({ url: 'api/users', body: user, headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` } });
}

async function updateUser(id, user) {
    return Put({ url: `api/users/${id}`, body: user, headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` } });
}

async function deleteUser(id) {
    return Delete({ url: `api/users/${id}`, headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` } });
}

export default {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
};
