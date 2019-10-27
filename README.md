# Face The Music

Face The Music is a video game that uses music to teach players about climate change on Earth. Our game brings NASA Earth data to a wider audience, helping raise awareness for one of the most important issues of our time. Try it yourself at https://tinyurl.com/facethemusic2!

## Challenge Background

Human-caused climate change is damaging our planet in incredible ways. It has been estimated to cause 300,000 deaths and $125 billion in economic losses each year. People in developing countries are particularly vulnerable to worsening floods and droughts.

Many people don't realise the scale of the problem. Others might know but not realise that their favourite cities are the largest contributors to it.  

The data is out there - NASA have collected a lot of valuable data about the Earth's climate. However, not everyone can easily access, navigate and understand it.

## Our Solution

Our game makes NASA's climate data fun to explore and easy to understand. Players travel the globe listening to a calm, peaceful song. The Earth's song sounds beautiful to start with, but gets distorted and polluted when the player selects a city with high pollution levels (for example, Seoul has a very high carbon footprint). The player must select cleaner cities to restore the Earth's song to its clean, harmonious sound.

The game has several rounds, each of which focus on a different climate metric derived from NASA Earth data. For example, in Round 1, the player searches for the city with the lowest carbon emissions. The song playing in the background is distorted in multiple ways, but the player can "clean up" one of the distortions by selecting cities with low carbon dioxide output. When the player finds a city with very low carbon emissions (such as Vancouver), they remove a distortion from the song entirely, and move to the next round. Round 2 might focus on cities with low increases in temperature.

With each round, the player removes different impurities from the song, eventually ending up with a clean song. At the end of the game, players earn a "Climate IQ" score based on how green their chosen cities are. We show them the cleanest and dirtiest cities in term of each climate metric, and provide links to NASA Earth datasets for them to explore in more depth.

## To Infinity and Beyond

Since the hackathon weekend, we have already improved the game so that the NASA data is more fun and easy to explore. We have deployed the game to a website https://tinyurl.com/facethemusic2 and will use it for improving education and social awareness.

Our game engages a wider audience in NASA's data. Players can interact with music rather than read numbers and graphs. The game runs on mobile devices, so gamers can spin the globe with their fingers on touchscreen phones or tablets, and play wherever they like. 

Teachers could use the game to support lessons about world geography and climate. The  "Climate IQ" score motivates students to get the best score they can, and even repeat the game multiple times. Teachers could optionally let students share their Climate IQ in a global leaderboard, inspiring students to learn alongside players from different nations and cultures around the world.

The game can also place a public spotlight on cities causing the most climate change. Players will be able to share their findings on social media, for example celebrating Copenhagen's clean air on Facebook, or calling for New York to reduce its carbon footprint on Twitter. 

Our game fosters a community of climate learners using NASA data. It educates them and gives them a voice with which to demand improvements from our policy makers. Together, we can face the music about climate change and help solve one of the most important challenges of our time.

## Data and Technology Used

We use various streams of NASA data about the Earth's climate, including:
* Carbon footprints by city (https://earthobservatory.nasa.gov/images/144807/sizing-up-the-carbon-footprint-of-cities)
* Tree cover, aerosol density, and temperature levels  (https://datasearch.globe.gov/)
* Satellite images visually representing levels of Carbon Monoxide, Nitrous Oxide, Ozone, and Temperature (https://wiki.earthdata.nasa.gov/display/GIBS/GIBS+Available+Imagery+Products)
* Fire detection, Carbon Dioxide, Methane, Aerosol Optical Depth, Carbon Monoxide: Satellite derived data and imagery from NASA Worldview (https://worldview.earthdata.nasa.gov/)
* Environmental Vulnerability Index (https://search.earthdata.nasa.gov/search/granules?p=C1418622315-SEDAC&g=G1418631524-SEDAC&m=-0.0703125!0!2!1!0!0%2C2&tl=1556182502!4!!&fsm0=Environmental%20Vulnerability%20Index%20(Evi)&fst0=Climate%20Indicators)

Our game is coded in JavaScript, supported by the following technologies:
* Game app
    * React
    * CesiumJS
    * sine-waves (https://github.com/isuttell/sine-waves)
    * Tone.js
    * howler.js
* Game server
    * Node.js 
* Hosting the game on the cloud
    * IBM Cloud Foundry
