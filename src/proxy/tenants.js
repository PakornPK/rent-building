import { Post, Get, Put, Delete } from './http';

function getTenants(currentPage, pageSize, sort) {
    return Get({ url: `api/tenants?page=${currentPage}&page_size=${pageSize}&sort=${sort}`, headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` } });
}

function getTenant(id) {
    return Get({ url: `api/tenants/${id}`, headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` } });
}

function createTenant(tenant) {
    return Post({ url: 'api/tenants', body: tenant, headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` } });
}

function updateTenant(id, tenant) {
    return Put({ url: `api/tenants/${id}`, body: tenant, headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` } });
}

function deleteTenant(id) {
    return Delete({ url: `api/tenants/${id}`, headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` } });
}

function downloadBill(id) { 
    return Post({ url: 'api/tenants/invoice', body: {tenant_id:id}, headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` } });
}

export default {
    getTenants,
    getTenant,
    createTenant,
    updateTenant,
    deleteTenant,
    downloadBill
};