const getPollutionQuestion = ( pollutionStage ) => {
  switch ( pollutionStage ) {
    case 'co2':
      return 'Which city has the smallest carbon footprint?';
    case 'landfill':
      return 'Which city has the lowest landfilled waste percentage?';
    case 'nitrousOxides':
      return 'Which city emits the least nitrous oxide?';
    case 'warming':
      return 'Which city has warmed the least since 1900?';
    default:
      return 'ERROR';
  }
};

const getPollutionString = ( pollutionStage, value ) => {
  switch ( pollutionStage ) {
    case 'co2':
      return `${Math.round( value / 1000000 )}Mt`;
    case 'landfill':
      return `${value}%`;
    case 'nitrousOxides':
      return `${value} ppbv`;
    case 'warming':
      return `+${value}°C`;
    default:
      return 'ERROR';
  }
};

const cleanestCities = {
  co2: {
    name: 'Harbin',
    value: 24086000
  },
  warming: {
    name: 'Guangzhou',
    value: 1.12,
  },
  nitrousOxides: {
    name: 'Melbourne',
    value: 163,
  },
};

const dataOfCleanestCities = {
  name: "Copenhagen",
  population: 21253719,
  co2NatPercentage: 45.1,
  location: {
    long: 126.9629,
    lat: 37.48175
  },
  co2: 24086000,
  warming: 1.12,
  landfill: 1,
  nitrousOxides: 163,
};

const pollutionStages = ['co2', 'nitrousOxides', 'warming'];

const songLocations = [
  { name: 'Amazon Rainforest', cameraLocation: { longitude: -62.2187, latitude: -3.46449 }, variant: 'success' },
  { name: 'African Savannah', cameraLocation: { longitude: 22.609, latitude: 6.5329 }, variant: 'warning' },
  { name: 'Great Barrier Reef', cameraLocation: { longitude: 147.7, latitude: -18.11238 }, variant: 'primary' },
];

export {
  getPollutionQuestion,
  getPollutionString,
  cleanestCities,
  dataOfCleanestCities,
  pollutionStages,
  songLocations,
}
