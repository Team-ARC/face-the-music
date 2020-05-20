const port = process.env.PORT || 4000;

const origins = {
    cloud: 'https://face-the-music.eu-gb.cf.appdomain.cloud',
    netlify: 'https://magicdeck.netlify.app/.netlify/functions/api',
    local: `http://localhost:${port}`,
  };

const serverLocation = 'netlify';
// const serverLocation = process.env.REACT_APP_SERVER_LOCATION || 'local';

const origin = origins[serverLocation];

console.log(`Client expects server at origin: ${origin}`);

module.exports = {
    origin,
}
