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

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors({
    origin: true
}));

app.use('/api', routes);
app.use('/.netlify/functions/api', routes);
app.use('/', (req, res) => {
    console.log('hit /');
    res.send('hit app /');
});
app.use(methodOverride());

module.exports = app;
