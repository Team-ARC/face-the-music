const express = require('express');

const mapRoutes = require('./map.route');

const router = new express.Router({ mergeParams: true });

router.use('/maps', mapRoutes);

router.use('/api', router);

module.exports = router;
