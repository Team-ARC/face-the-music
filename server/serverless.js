const serverless = require('serverless-http');
const path = require('path');

const app = require('./app');

module.exports.handler = serverless(app, {
    basePath: `/.netlify/functions/${path.parse(__filename).name}`,
});
