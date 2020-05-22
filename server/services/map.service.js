const { getDistance } = require('geolib');

const cityData = require('../data/cities.final.json');

const getClosestCity = (longitude, latitude) => {
    const distanceCities = cityData.map(city => {
        city.distance = getDistance({ longitude, latitude }, { longitude: city.location.long, latitude: city.location.lat });
        return city;
    })
    distanceCities.sort((a, b) => a.distance-b.distance);
    return distanceCities.slice(0, 4);
};

const getCity = (id) => {
    return cityData.find(p => p.id === id);
};

const getCities = () => {
    return cityData;
};

module.exports = {
    getClosestCity,
    getCity,
    getCities
}
