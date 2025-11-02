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

function removeRentals(rental) {
    return Delete({
        url: `api/rooms/rental`,
        body: rental,
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
}

function getDiffRentalsByRoomId(id) {
    return Get({
        url: `api/rooms/${id}/rental`,
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
}

function updateRental(rentalId, rental) {
    return Put({
        url: `api/rooms/${rentalId}/rental`,
        body: rental,
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
}

function getRoomVacant() {
    return Get({
        url: `api/rooms/dropdown?status=VACANT`,
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
}

function swapRoom(tenantID, current, traget) {
    return Post({
        url: `api/rooms/swap`,
        body: { tenant_id: tenantID, current: current, traget: traget },
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
}

function getCurrentRoom(id){
    return Get({
        url: `api/rooms/dropdown?tenant_id=${id}`,
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
    removeRentals,
    getDiffRentalsByRoomId,
    updateRental,
    getRoomVacant,
    swapRoom,
    getCurrentRoom
}