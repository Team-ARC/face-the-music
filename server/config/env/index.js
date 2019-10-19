require('dotenv').config();
const environments = ['development', 'production'];
const defaultEnv = environments[0];
let nodeEnv = process.env.NODE_ENV || 'development';
if(!environments.includes(nodeEnv)) {
    console.log(`Invalid NODE_ENV, defaulting to ${defaultEnv}`);
    nodeEnv = defaultEnv;
}

module.exports = require(`./${nodeEnv}`);
