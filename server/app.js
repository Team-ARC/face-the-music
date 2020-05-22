const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors')

const routes = require('./routes/index.route');

const app = express();

app.use(cookieParser());
app.use(compress());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors({
    origin: true
}));

app.use('/', routes);
app.use('/health', (req, res) => res.sendStatus(200));
app.use(methodOverride());

module.exports = app;
