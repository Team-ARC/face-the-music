/* jshint esversion: 6 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors')

const config = require('./server/config/env');
const routes = require('./server/routes/index.route');

const port = config.port;
const app = express();

app.set('port', port);

app.use(cookieParser());
app.use(compress());

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors({
    origin: true
}));

app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/', routes);
app.use(methodOverride());

app.listen(port, () => {
    console.log(`server started on port ${port} (${port})`);
});

module.exports = app;
