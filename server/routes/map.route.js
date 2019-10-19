const express = require('express');

const controller = require('../controllers/map.controller');

const router = new express.Router({ mergeParams: true });

router.post('/locate', controller.findNearestCity);
router.get('/cities/:id', controller.getCity);
router.get('/cities', controller.getCities);

module.exports = router;