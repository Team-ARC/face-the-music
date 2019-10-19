const express = require('express');

const mapRoutes = require('./map.route');

const router = new express.Router({ mergeParams: true });

router.use('/api/maps', mapRoutes);

module.exports = router;
