const mapService = require('../services/map.service');

const getCity = (req, res, next) => {
    const { long, lat } = req.body;
    try {
        const city = mapService.getClosestCity(long, lat);
        return res.status(200).send(city);
    } catch(err) {
        return next(err);
    }
}

module.exports = {
    getCity
};
