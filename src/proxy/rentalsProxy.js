import { Post, Get, Put, Delete } from "./http";

function createRental(rental) {
    return Post({
        url: "api/rentals",
        body: rental,
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
}

function updateRental(id, rental) {
    return Put({
        url: `api/rentals/${id}`,
        body: rental,
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
}

function deleteRental(id) {
    return Delete({
        url: `api/rentals/${id}`,
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
}

function getRentals(page, pageSize, sort) {
    return Get({
        url: `api/rentals?page=${page}&page_size=${pageSize}&sort=${sort}`,
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
}

function getRentalDetail(id) {
    return Get({
        url: `api/rentals/${id}`,
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
}

export default {
    createRental,
    updateRental,
    deleteRental,
    getRentals,
    getRentalDetail
}