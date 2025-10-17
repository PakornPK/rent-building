import { Post, Get, Put, Delete } from './http';

function createRooms(rooms) {
    return Post({
        url: "api/rooms",
        body: rooms,
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
}

function updateRooms(id, rooms) {
    return Put({
        url: `api/rooms/${id}`,
        body: rooms,
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
}

function getRooms(page, pageSize, sort) {
    return Get({
        url: `api/rooms?page=${page}&page_size=${pageSize}&sort=${sort}`,
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
}

function deleteRooms(id) {
    return Delete({
        url: `api/rooms/${id}`,
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
}

function getRoomDetails(id) {
    return Get({
        url: `api/rooms/${id}`,
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
}

function addRentals(rentals) {
    return Post({
        url: `api/rooms/rental`,
        body: rentals,
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
}

function removeRentals(id) {
    return Delete({
        url: `api/rooms/rental/${id}`,
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
}

export default {
    createRooms,
    updateRooms,
    getRooms,
    deleteRooms,
    getRoomDetails,
    addRentals,
    removeRentals
}