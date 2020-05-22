const port = process.env.PORT || 4000;

const origins = {
    cloud: 'https://face-the-music.eu-gb.cf.appdomain.cloud',
    netlify: 'https://face-the-music.netlify.app/.netlify/functions/api',
    local: `http://localhost:${port}`,
  };

// const serverLocation = 'netlify';
console.log('process.env');
console.log(process.env);
const serverLocation = process.env.REACT_APP_SERVER_LOCATION || (process.env.NODE_ENV === 'production' ? 'netlify' : 'local');

const origin = origins[serverLocation];

console.log(`Client expects server at origin: ${origin}`);

module.exports = {
    origin,
}
