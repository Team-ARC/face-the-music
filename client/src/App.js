import React from 'react';
import { Button, Container, ListGroup, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTemperatureHigh, faTrash, faSmog } from '@fortawesome/free-solid-svg-icons'

import './App.css'
import CesiumMap from './components/CesiumMap'
import { getCities } from './services/location.service'
import { startNiceMusic } from './services/music.service';
import logo from './assets/logo.png';

const matchLimit = 0;
const cleanestCity = {
  "name": "Copenhagen",
  "country": "Made up",
  "countryAlt": "Made up",
  "population": 21253719,
  "co2NatPercentage": 45.1,
  "location": {
    "long": 126.9629,
    "lat": 37.48175
  },
  "co2": 24086000,
  "warming": 0.72,
  "landfill": 1,
  "nitrousOxides": 163,
  "id": 29
};

const cleanestCities = {
  co2: 'Harbin',
  warming: 'Guangzhou',
  nitrousOxides: 'Melbourne',
}

export default class App extends React.Component {

  constructor() {
    library.add(faTemperatureHigh, faTrash, faSmog)
    super();
    this.state = {
      stage: 'START',
      pollutionStage: 'co2',
      pollutionStages: ['co2', 'nitrousOxides', 'warming'],
      pollutionStageIndex: -1,
      selectedCity: null,
      startingCity: null,
      comparedCity: '',
      matchPercentage: 0,
      results: [],
      cities: [],
      availableCities: [
        { name: 'Amazon Rainforest', cameraLocation: { longitude: -62.2187, latitude: -3.46449 }, variant: 'success' },
        { name: 'African Savannah', cameraLocation: { longitude: 22.609, latitude: 6.5329 }, variant: 'warning' },
        { name: 'Great Barrier Reef', cameraLocation: { longitude: 147.7, latitude: -18.11238 }, variant: 'primary' },
      ],
      city: { name: 'Amazon Rainforest', cameraLocation: { longitude: -62.2187, latitude: -3.46449 } },
      cameraLocation: { longitude: -62.2187, latitude: -3.46449 },
    }
    this.selectCity = this.selectCity.bind(this);
    this.mapComplete = this.mapComplete.bind(this);
    this.setMatchPercentage = this.setMatchPercentage.bind(this);
    this.incrementStage = this.incrementStage.bind(this);
    this.startGame = this.startGame.bind(this);

    this.getAvailableCities();
  }

  getPollutionLabel(pollutionStage) {
    switch (pollutionStage) {
      case 'co2':
        return 'CO2 Emissions';
      case 'landfill':
        return 'Landfilled Waste Percentage';
      case 'nitrousOxides':
        return 'Nitrous Oxide Level';
      case 'warming':
        return 'Temperature Rise Since 1960';
      default:
        return 'ERROR';
    }
  }

  setMatchPercentage(matchPercentage, name) {
    this.setState({ matchPercentage: Math.round(matchPercentage) });
    this.setState({ comparedCity: name });
  }

  getPollutionQuestion(pollutionStage) {
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
  }

  getPollutionIcon(pollutionStage) {
    switch (pollutionStage) {
      case 'co2':
        return 'smog';
      case 'landfill':
        return 'trash';
      case 'nitrousOxides':
        return 'smog';
      case 'warming':
        return 'temperature-high';
      default:
        return 'ERROR';
    }
  }

  getPollutionString(pollutionStage, value) {
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
  }

  async getAvailableCities() {
    let { availableCities } = this.state;
    const cities = await getCities();
    availableCities = availableCities.map(avail => {
      avail.id = 10;
      return avail;
    })
    this.setState({ cities, availableCities });
  }

  selectCity(index) {
    const city = this.state.availableCities[index];
    // this.setState({ selectedCity: city, stage: 'MAP' });
    this.setState({ startingCity: city, cameraLocation: city.cameraLocation });
  }

  mapComplete(results) {
    this.setState({ stage: 'SUMMARY', results });
  }

  incrementStage() {
    const { matchPercentage, pollutionStageIndex, pollutionStages } = this.state;
    if (matchPercentage >= matchLimit) {
      const newStageIndex = pollutionStageIndex + 1;
      const update = {
        pollutionStageIndex: newStageIndex
      }
      if (pollutionStages[newStageIndex]) {
        update.pollutionStage = pollutionStages[newStageIndex]
      }
      this.setState(update)
    }
  }

  startGame() {
    this.setState({ stage: 'MAP', pollutionStageIndex: 0, pollutionStage: this.state.pollutionStages[0] });
  }

  render() {
    const { stage, availableCities, selectedCity, startingCity, results, pollutionStage, matchPercentage, pollutionStageIndex, comparedCity } = this.state;
    const scoreTotal = (accumulator, currentValue) => accumulator + currentValue.score;

    const pollutionStageNames = {
      co2: 'Carbon Footprint',
      nitrousOxides: 'Nitrous Oxide',
      warming: 'Temperature Rise',
      fire: 'Fire Risk',
    }
    const pollutionStageName = pollutionStageNames[pollutionStage];
    return (
      <div style={{ height: '100%', position: "relative" }} className={stage !== 'MAP' ? 'texture' : ''}>
        {stage === 'START' ?
          <Container style={{ maxWidth: '50%', paddingTop: '20vh' }}>
            <img className="center" src={logo} alt="Logo" />
            <h1 style={{ textAlign: 'center', marginBottom: '60px' }}>Face the Music</h1>
            <h3 style={{ textAlign: 'center', marginBottom: '80px' }}>Rediscover the Earth's natural songs</h3>
            <h3 style={{ textAlign: 'center', marginBottom: '80px' }}>{'process.env'}</h3>
            <h3 style={{ textAlign: 'center', marginBottom: '80px' }}>{process.env}</h3>
            <Button
              variant="info" size="lg" block
              onClick={() => {
                this.setState({
                  stage: 'SELECT',
                  selectedCity: cleanestCity,
                });
              }}>
              Play
          </Button>
            <Button
              variant="outline-info" size="lg" block
              onClick={() => {
                this.setState({
                  stage: 'INSTRUCTIONS',
                  selectedCity: cleanestCity,
                });
              }}>
              Instructions
              </Button>
          </Container>
          : null}
        {stage === 'INSTRUCTIONS' ?
          <Container style={{ maxWidth: '50%', paddingTop: '20vh' }}>
            <img className="center" src={logo} alt="Logo" />
            <h1 style={{ textAlign: 'center', marginBottom: '60px' }}>Face the Music</h1>
            <h3 style={{ textAlign: 'center' }}>To play the game, first choose a biome to begin your journey</h3>
            <h3 style={{ textAlign: 'center' }}>Then move the globe to a city which best answers the question</h3>
            <h3 style={{ textAlign: 'center' }}>Once you're happy with your choice, you can go to the next question by pressing the bottom right button</h3>
            <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>The cleaner the city you select, the cleaner the song becomes!</h3>
            <Button
              variant="outline-info" size="lg" block
              onClick={() => {
                this.setState({
                  stage: 'START',
                  selectedCity: cleanestCity,
                });
              }}>
              Back
            </Button>
          </Container>
          : null}
        {stage === 'MAP' || stage === 'SELECT' ?
          <div style={{ position: "absolute", top: 0, left: 0, width: '100%' }}>
            <CesiumMap style={{ position: "absolute", top: 0, left: 0 }}
              className="map"
              city={startingCity}
              cameraLocation={this.state.cameraLocation}
              setMatchPercentage={this.setMatchPercentage}
              onComplete={this.mapComplete}
              stageIndex={pollutionStageIndex} />,
            <div style={{ display: pollutionStageIndex < 0 ? "none" : "block" }} className='hud'>
              <h2 className='question'>{this.getPollutionQuestion(pollutionStage)}</h2>
              <canvas className="waves" id="waves" />
              <div className='sideBox leftBox' style={{ backgroundColor: `rgb(${((matchPercentage / 100)) * 220}, ${(1 - (matchPercentage / 100)) * 220}, 0, 1)` }}>
                <div className='top-text' >
                  {`Selected City: `}
                  <span style={{ fontWeight: 'bold' }}>{comparedCity}</span>
                </div>
                <FontAwesomeIcon icon={this.getPollutionIcon(pollutionStage)} size="2x"></FontAwesomeIcon>
                <div className='bottom-text' >{pollutionStageName}</div>
              </div>
              <div onClick={this.incrementStage} className={'sideBox rightBox ' + (matchPercentage >= matchLimit ? 'rightBoxEnable' : 'rightBoxDisable')} style={{ backgroundColor: `rgb(${((matchPercentage / 100)) * 220}, ${(1 - (matchPercentage / 100)) * 220}, 0, 1)` }}>
                <div className="percent">
                  <div className='text'>{`${matchPercentage}%`}</div>
                  <br />
                  <div className='text'>{'too high'}</div>
                </div>
                <div className="percent"></div>
                {matchPercentage >= matchLimit ? (
                  <i className="fa fa-arrow-right nextButton"></i>
                ) : null}
              </div>
            </div>
            <div className="circle circle-center"></div>
          </div>
          : null}

        {stage === 'SELECT' ?
          <Container style={{ paddingTop: '20vh', position: 'absolute', height: '100vh', minWidth: '100%', backgroundColor: 'rgba(0,0,0,0.7)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Every ecosystem has a song. Choose one:</h2>
            <Row className="justify-content-md-center" style={{ marginLeft: '30vw', marginRight: '30vw', marginBottom: '140px' }}>
              {availableCities.map((city, index) => (
                <Button
                  variant={startingCity && startingCity.name === city.name ? city.variant : `outline-${city.variant}`} size="lg" block
                  style={{ marginBottom: '30px' }}
                  onClick={() => {
                    this.selectCity(index);
                    startNiceMusic(city.name);
                  }}>
                  {city.name}
                </Button>
              ))}
            </Row>
            {startingCity ?
              <Row className="justify-content-md-center" style={{ marginLeft: '30vw', marginRight: '30vw' }}>
                <Button
                  variant={'outline-info'} size="lg" block
                  onClick={this.startGame}>
                  Start
              </Button>
              </Row>
              : null}
          </Container>
          : null}
        {stage === 'SUMMARY' ?
          <Container style={{ maxWidth: '70%', paddingTop: '15vh' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Results</h1>
            <h2 style={{ textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}>
              {`Congratulations, your Climate IQ is `}
              <span style={{ fontWeight: 'bold' }}>{`${150 - Math.round(results.reduce(scoreTotal, 0) / results.length)}`}</span>
              {'!'}
            </h2>
            <ListGroup>
              {results.map(result => (
                <ListGroup.Item variant={result.score > 70 ? 'danger' : result.score > 20 ? 'warning' : 'success'}>
                  <h2 style={{ fontWeight: 'bold' }}>
                    {this.getPollutionQuestion(result.stage)}
                  </h2>
                  <h3>
                    {'You chose '}
                    <span style={{ fontWeight: 'bold' }}>{result.name}</span>
                    {` (${this.getPollutionString(result.stage, result.data[result.stage])})`}
                  </h3>
                  <h3>
                    {'The best city was '}
                    <span style={{ fontWeight: 'bold' }}>{cleanestCities[result.stage]}</span>
                    {` (${this.getPollutionString(result.stage, selectedCity[result.stage])})`}
                  </h3>
                  <h3>
                    {'Your city was '}
                    <span style={{ fontWeight: 'bold' }}>{`${Math.round(result.score)}%`}</span>
                    {' more polluting.'}
                  </h3>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Container>
          : null}
      </div>);
  }
}
