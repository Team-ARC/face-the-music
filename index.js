/* jshint esversion: 6 */

const express = require('express');
const path = require('path');

const app = require('./server/app')
const { port } = require('./server/config/env');

app.use(express.static(path.join(__dirname, 'client/build')));

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});
