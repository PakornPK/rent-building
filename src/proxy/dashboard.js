import { Get } from './http';

function getDashboard() { 
    return Get({
        url: `api/dashboard`,
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` }
    });
}

export default { 
    getDashboard
}