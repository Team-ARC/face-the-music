const cityData = require('../data/cities.final.json');
const { getDistance } = require('geolib')

const getClosestCity = (longitude, latitude) => {
    const distanceCities = cityData.map(city => {
        city.distance = getDistance({ longitude, latitude }, { longitude: city.location.long, latitude: city.location.lat });
        return city;
    })
    distanceCities.sort((a, b) => a.distance-b.distance);
    return distanceCities.slice(0, 4);
};

module.exports = {
    getClosestCity
}