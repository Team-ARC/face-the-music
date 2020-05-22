const mapService = require('../services/map.service');

const findNearestCity = (req, res, next) => {
    const { long, lat } = req.body;
    try {
        const city = mapService.getClosestCity(long, lat);
        return res.status(200).send(city);
    } catch (err) {
        return next(err);
    }
}

const getCities = (req, res, next) => {
    res.status(201).send('getCities');
    // const cities = mapService.getCities();
    // res.status(200).send(cities);
};

const getCity = (req, res, next) => {
    const { id } = req.params;
    const city = mapService.getCity(Number(id));
    if(!city) {
        return res.sendStatus(404);
    }
    return res.status(200).send(city);
};

module.exports = {
    findNearestCity,
    getCities,
    getCity
};
