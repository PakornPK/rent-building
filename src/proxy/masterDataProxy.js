import { Get } from './http';

async function getMasterData(key, value) {
    let url = `api/master-data/dropdown?key=${key}`;
    if (value) {
        url += `&value=${value}`;
    }
    return Get({ url: url, headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("access_token")}` } });
}

export default {
    getMasterData,
};
