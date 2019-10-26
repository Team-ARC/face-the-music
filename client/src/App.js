import React from 'react';
import CesiumMap from './components/CesiumMap'
import { getCities } from './services/location.service'
import { Button, Container, ListGroup, ButtonToolbar, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './App.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTemperatureHigh, faTrash, faSmog } from '@fortawesome/free-solid-svg-icons'

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
  "id": 29
};

export default class App extends React.Component {

  constructor() {
    library.add(faTemperatureHigh, faTrash, faSmog)
    super();
    this.state = {
      stage: 'START',
      pollutionStage: 'co2',
      pollutionStages: ['co2', 'landfill', 'warming'],
      pollutionStageIndex: -1,
      selectedCity: null,
      comparedCity: '',
      matchPercentage: 0,
      results: [],
      cities: [],
      availableCities: [
        { name: 'Amazon Rainforest', cameraLocation: {longitude: -62.2187, latitude: -3.46449},  },
        { name: 'African Savannah', cameraLocation: {longitude: 22.609, latitude: 6.5329} },
        { name: 'Great Barrier Reef', cameraLocation: {longitude: 147.7, latitude: -18.11238} },
      ],
      city: { name: 'Amazon Rainforest', cameraLocation: {longitude: -62.2187, latitude: -3.46449} },
      cameraLocation:  {longitude: -62.2187, latitude: -3.46449},
    }
    this.selectCity = this.selectCity.bind(this);
    this.mapComplete = this.mapComplete.bind(this);
    this.setMatchPercentage = this.setMatchPercentage.bind(this);
    this.incrementStage = this.incrementStage.bind(this);
    this.getAvailableCities();
    this.city = this.state.availableCities[0];
  }

  getPollutionLabel(pollutionStage) {
    switch (pollutionStage) {
      case 'co2':
        return 'CO2 Emissions';
      case 'landfill':
        return 'Landfilled Waste Percentage';
      case 'warming':
        return 'Tempature Increase since 1960';
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
      case 'warming':
        return 'Which city has had the lowest rise in temperature since 1960?';
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
      case 'warming':
        return 'temperature-high';
      default:
        return 'ERROR';
    }
  }

  getPollutionString(pollutionStage, value) {
    switch (pollutionStage) {
      case 'co2':
        return `${Math.round(value/1000000)}Mt`;
      case 'landfill':
        return `${value}%`;
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

  selectCity(id) {
    const city = this.state.cities.find(p => p.id === id);
    this.setState({ selectedCity: city, stage: 'MAP' });
  }

  mapComplete(results) {
    this.setState({ stage: 'SUMMARY', results });
  }

  incrementStage() {
    const { matchPercentage, pollutionStageIndex, pollutionStages } = this.state;
    if (matchPercentage >= matchLimit) {
      const newStageIndex = pollutionStageIndex + 1;
      console.log('newStageIndex ' + newStageIndex);
      console.log('pollutionStages[newStageIndex] ' + pollutionStages[newStageIndex]);
      const update = {
        pollutionStageIndex: newStageIndex
      }
      if (pollutionStages[newStageIndex]) {
        update.pollutionStage = pollutionStages[newStageIndex]
      }
      this.setState(update)
    }
  }

  render() {
    const { stage, availableCities, selectedCity, results, pollutionStage, matchPercentage, pollutionStageIndex, comparedCity } = this.state;
    const scoreTotal = (accumulator, currentValue) => accumulator + currentValue.score;
    
    const pollutionStageNames = {
      co2: 'Carbon Footprint',
      warming: 'Temperature Rise',
      fire: 'Fire Risk',
    }
    const pollutionStageName = pollutionStageNames[pollutionStage];
    console.log("pollutionStageIndex")
    console.log(results)
    return (
      <div style={{ height: '100vh', height: '100vh', position: "relative" }} className={stage !== 'MAP' ? 'texture' : ''}>
        {stage === 'START' ?
          <Container style={{ maxWidth: '50%', paddingTop: '20vh' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '60px' }}>Face the Music</h1>
            <h3 style={{ textAlign: 'center', marginBottom: '80px' }}>Understand the impact of your city to tune into its inner song</h3>
            <Button
              variant="outline-info" size="lg" block
              onClick={() => {
                this.setState({
                  stage: 'SELECT',
                  selectedCity: cleanestCity,
                });
              }}>
              Play
                </Button>
          </Container>
          : null}
        {stage === 'MAP' || stage === 'SELECT' ?
          <div style={{ position: "absolute", top: 0, left: 0 }}>
            <CesiumMap style={{ position: "absolute", top: 0, left: 0 }}
              className="map"
              city={this.state.city}
              cameraLocation={this.state.cameraLocation}
              setMatchPercentage={this.setMatchPercentage}
              onComplete={this.mapComplete}
              stageIndex={pollutionStageIndex} />,
            <div style={{display: pollutionStageIndex < 0 ? "none" : "block"}} className='hud'>
              <h2 className='question'>{this.getPollutionQuestion(pollutionStage)}</h2>
              <canvas className="waves" id="waves" />
              <div className='sideBox leftBox' style={{ backgroundColor: `rgb(${((matchPercentage / 100)) * 220}, ${(1 - (matchPercentage / 100)) * 220}, 0, 1)` }}>
                <div className='top-text' >{`Current city: ${comparedCity}`}</div>
                <FontAwesomeIcon icon={this.getPollutionIcon(pollutionStage)} size="2x"></FontAwesomeIcon>
                <div className='bottom-text' >{pollutionStageName}</div>
              </div>
              <div onClick={this.incrementStage} className={'sideBox rightBox ' + (matchPercentage >= matchLimit ? 'rightBoxEnable' : 'rightBoxDisable')} style={{ backgroundColor: `rgb(${((matchPercentage / 100)) * 220}, ${(1 - (matchPercentage / 100)) * 220}, 0, 1)` }}>
                <div className="percent">
                  <div className='text' >{`${matchPercentage}%`}</div>
                  <br />
                  <div className='text' >{'too high'}</div>
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
          <Container style={{ paddingTop: '20vh', position:'absolute', height: '100vh', minWidth: '100%', backgroundColor: 'rgba(0,0,0,0.7)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Choose your city</h2>

            <ButtonToolbar style = {{"margin-left": '35vw'}}>
              <ToggleButtonGroup type="radio" name="options" defaultValue={0}>
                {availableCities.map((city, index) => (
                  <ToggleButton  variant="outline-info" size="lg" value={index} onClick={() => this.setState({city, cameraLocation: city.cameraLocation})} >{city.name}</ToggleButton>
                ))}
              </ToggleButtonGroup>
            </ButtonToolbar>
            <br />
            <br />
            <Button
              variant="outline-info" size="lg" block
              style={{ marginBottom: '30px' }}
              onClick={() => { 
                this.selectCity(this.state.city.id);
                this.setState({
                  selectedCity: cleanestCity,
                })
                this.incrementStage();
              }}>
              Select
            </Button>
          </Container>
          : null}
        {stage === 'SUMMARY' ?
          <Container style={{ maxWidth: '70%', paddingTop: '15vh' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Results</h2>
            <ListGroup>
              {results.map(result => (
                <ListGroup.Item variant={result.score > 20 ? 'success' : 'warning'}>
                  <h2>{this.getPollutionLabel(result.stage)}</h2>
                  <h3>{`${selectedCity.name}: ${this.getPollutionString(result.stage, selectedCity[result.stage])}`}</h3>
                  <h3>{`${result.name}: ${this.getPollutionString(result.stage, result.data[result.stage])}`}</h3>
                  <h3 style={{fontWeight: 'bold'}}>{`${100 - Math.round(result.score)}% match`}</h3>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <h2 style={{ textAlign: 'center', marginTop: '40px' }}>{`Score ${100 - Math.round(results.reduce(scoreTotal, 0) / results.length)}%`}</h2>
          </Container>
          : null}
      </div>);
  }
}
