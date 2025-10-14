import { Post, Get, Put } from "./http"

function createBuildings(buildings) {
    return Post({
        url: "api/buildings",
        body: buildings,
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
}

function updateBuildings(id, buildings) {
    return Put({
        url: `api/buildings/${id}`,
        body: buildings,
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
}

function getBuildings(page, pageSize, sort) {
    return Get({
        url: `api/buildings?page=${page}&page_size=${pageSize}&sort=${sort}`,
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
}

function getBuildingsDropdown() {
    return Get({
        url: `/api/buildings/dropdown`,
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
}

export default { 
    createBuildings,
    updateBuildings,
    getBuildings,
    getBuildingsDropdown
}