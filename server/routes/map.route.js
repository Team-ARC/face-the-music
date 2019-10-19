const express = require('express');

const controller = require('../controllers/map.controller');

const router = new express.Router({ mergeParams: true });

router.post('/city', controller.getCity);

module.exports = router;