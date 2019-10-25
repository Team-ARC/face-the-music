import axios from 'axios'

import { origin } from '../config';

export async function getCity(id) {
    const result = await axios.get(`${origin}/api/maps/cities/${id}`);
    return result.data;
};

export async function getCities() {
    const result = await axios.get(`${origin}/api/maps/cities`);
    return result.data;
};

export async function getNearestCity(long, lat) {
    const result = await axios.post(`${origin}/api/maps/locate`, { long, lat });
    return result.data;
};
