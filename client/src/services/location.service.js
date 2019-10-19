import axios from 'axios'

const basepath = 'http://localhost:4000';

export async function getCity(id) {
    const result = await axios.get(`${basepath}/api/maps/cities/${id}`);
    return result.data;
};

export async function getCities() {
    const result = await axios.get(`${basepath}/api/maps/cities`);
    return result.data;
};

export async function getNearestCity(long, lat) {
    const result = await axios.post(`${basepath}/api/maps/locate`, { long, lat });
    return result.data;
};