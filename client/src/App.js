import React from 'react';
import { Button, Container, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import './App.css'
import CesiumMap from './components/CesiumMap'
import { startNiceMusic } from './services/music.service';
import logo from './assets/logo.png';

const matchRequirement = 100;

const pollutionStages = ['co2', 'nitrousOxides', 'warming'];

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

const songLocations = [
  { name: 'Amazon Rainforest', cameraLocation: { longitude: -62.2187, latitude: -3.46449 }, variant: 'success' },
  { name: 'African Savannah', cameraLocation: { longitude: 22.609, latitude: 6.5329 }, variant: 'warning' },
  { name: 'Great Barrier Reef', cameraLocation: { longitude: 147.7, latitude: -18.11238 }, variant: 'primary' },
];

const getMatchPctColor = (matchPercentage) =>
  `rgb(${((matchPercentage / 100)) * 220}, ${(1 - (matchPercentage / 100)) * 220}, 0, 1)`;

const getPollutionQuestion = (pollutionStage) => {
  switch (pollutionStage) {
    case 'co2':
      return 'Which city has the lowest carbon footprint?';
    case 'landfill':
      return 'Which city has the lowest landfilled waste percentage?';
    case 'nitrousOxides':
      return 'Which city emits the least nitrous oxide?';
    case 'warming':
      return 'Which city is rising in temperature most slowly?';
    default:
      return 'ERROR';
  }
};

const getPollutionString = (pollutionStage, value) => {
  switch (pollutionStage) {
    case 'co2':
      return `${Math.round(value / 1000000)}Mt`;
    case 'landfill':
      return `${value}%`;
    case 'nitrousOxides':
      return `${value} ppbv`;
    case 'warming':
      return `${value} degrees`;
    default:
      return 'ERROR';
  }
};

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      stage: 'START',
      pollutionStage: '',
      pollutionStageIndex: -1,
      songLocation: null,
      currentLocation: '',
      matchPercentage: 0,
      results: [],
      cameraLocation: songLocations[0].cameraLocation,
    }
    this.selectCity = this.selectCity.bind(this);
    this.gameComplete = this.gameComplete.bind(this);
    this.setMatchPercentage = this.setMatchPercentage.bind(this);
    this.incrementStage = this.incrementStage.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  setMatchPercentage(matchPercentage, name) {
    this.setState({ matchPercentage: Math.round(matchPercentage) });
    this.setState({ currentLocation: name });
  }

  selectCity(city) {
    this.setState({ songLocation: city, cameraLocation: city.cameraLocation });
  }

  gameComplete(results) {
    this.setState({ stage: 'SUMMARY', results });
  }

  incrementStage() {
    const { pollutionStageIndex } = this.state;
    const newStageIndex = pollutionStageIndex + 1;
    const update = {
      pollutionStageIndex: newStageIndex,
    }
    if (pollutionStages[newStageIndex]) {
      update.pollutionStage = pollutionStages[newStageIndex];
    }
    this.setState(update);
  }

  startGame() {
    this.setState({ stage: 'MAP', pollutionStageIndex: 0, pollutionStage: pollutionStages[0] });
  }

  render() {
    const { stage, songLocation, results, pollutionStage, matchPercentage, pollutionStageIndex, currentLocation } = this.state;
    const scoreTotal = (accumulator, currentValue) => accumulator + currentValue.score;

    return (
      <div style={{ height: '100%', position: "relative" }} className={stage !== 'MAP' ? 'texture' : ''}>
        {stage === 'START' ?
          <Container fluid style={{
            flexFlow: 'column',
            textAlign: 'center',
            height: '96vh',
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            padding: '2vh 0',
          }}>
            <img className="logo" src={logo} alt="Logo" />
            <h1 style={{}}>Face The Music</h1>
            <h3 style={{}}>Rediscover the Earth's natural songs</h3>
            <Button
              className={'button'}
              variant="info" size="lg"
              onClick={() => this.setState({ stage: 'SELECT' })}>
              Play
          </Button>
          </Container>
          : null}
        {stage === 'MAP' || stage === 'SELECT' ?
          <div style={{ position: "absolute", top: 0, left: 0, width: '100%' }}>
            <CesiumMap style={{ position: "absolute", top: 0, left: 0 }}
              className="map"
              city={dataOfCleanestCities}
              cameraLocation={this.state.cameraLocation}
              setMatchPercentage={this.setMatchPercentage}
              onComplete={this.gameComplete}
              stageIndex={pollutionStageIndex}
            />
            {stage === 'MAP' ?
              <div>
                <div className='hud-title'>
                  <h2 className='question'>{getPollutionQuestion(pollutionStage)}</h2>
                </div>
                <div className='hud-base'>
                  <canvas className="waves" id="waves" />
                  <h3 className='question hud-statement'>
                    <span style={{
                      fontWeight: 'bold',
                      color: getMatchPctColor(matchPercentage),
                    }}>{currentLocation}</span>
                    {' is '}
                    <span style={{
                      fontWeight: 'bold',
                      color: getMatchPctColor(matchPercentage),
                    }}>{`${matchPercentage}%`}</span>
                    {' worse than the best city '}
                    {matchPercentage < matchRequirement
                      ? (<i className="fa fa-arrow-right" style={{ color: getMatchPctColor(matchPercentage) }} onClick={this.incrementStage}></i>)
                      : (<i className="fa fa-times" style={{ color: getMatchPctColor(matchPercentage) }}></i>)}
                  </h3>
                </div>
                <div className="circle circle-center"></div>
              </div>
            : null}
          </div>
        : null}

        {stage === 'SELECT' ?
          <div style={{
            position: 'absolute',
            height: '100vh',
            width: '100vw',
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexFlow: 'column',
            textAlign: 'center',
          }}>
            <h2 className={'hud-title'}>Every ecosystem has a song. Choose one:</h2>
            <div style={{
              alignItems: 'center',
              flexFlow: 'column',
              display: 'flex',
            }} className={'center'}>
              {songLocations.map((city, i) => (
                <Button
                  key={i}
                  className={'button'}
                  variant={songLocation && songLocation.name === city.name ? city.variant : `outline-${city.variant}`} size="lg"
                  style={{ margin: '0.5rem' }}
                  onClick={() => {
                    this.selectCity(city);
                    startNiceMusic(city.name);
                  }}>
                  {city.name}
                </Button>
              ))}
           </div>
            {songLocation ?
              <Button
                className={'button bottom'}
                variant={'info'} size="lg"
                onClick={this.startGame}>
                Start
              </Button>
            : null}
          </div>
          : null}
        {stage === 'SUMMARY' ?
          <div style={{
            flexFlow: 'column',
            textAlign: 'center',
            display: 'flex',
            minHeight: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <h1>Results</h1>
            <h2>
              {`Your Climate IQ is `}
              <span style={{ fontWeight: 'bold' }}>{`${150 - Math.round(results.reduce(scoreTotal, 0) / results.length)}`}</span>
            </h2>
            <ListGroup>
              {results.map((result, i) => (
                <ListGroup.Item
                  variant={result.score > 70 ? 'danger' : result.score > 20 ? 'warning' : 'success'}
                  key={i}
                >
                  <h3 style={{ fontWeight: 'bold' }}>
                    {getPollutionQuestion(result.stage)}
                  </h3>
                  <h5>
                    <span style={{ fontWeight: 'bold' }}>{result.name}</span>
                    {` (${getPollutionString(result.stage, result.data[result.stage])}) was `}
                    <span style={{ fontWeight: 'bold' }}>{`${Math.round(result.score)}%`}</span>
                    {' more polluting than the best city, '}
                    <span style={{ fontWeight: 'bold' }}>{cleanestCities[result.stage].name}</span>
                    {` (${getPollutionString(result.stage, cleanestCities[result.stage].value)})`}
                  </h5>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
          : null}
      </div>);
  }
}
