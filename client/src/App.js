import React from 'react';
import CesiumMap from './components/CesiumMap'
import { getCities } from './services/location.service'
import { Button, Container, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './App.css'
export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      stage: 'START',
      pollutionStage: 'co2',
      pollutionStages: ['co2', 'landfill', 'warming'],
      pollutionStageIndex: 0,
      selectedCity: null,
      matchPercentage: 0,
      results: [],
      cities: [],
      availableCities: [{ name: 'London' }, { name: 'Sydney' }, { name: 'New York' }, { name: 'Paris' }]
    }
    this.selectCity = this.selectCity.bind(this);
    this.mapComplete = this.mapComplete.bind(this);
    this.setMatchPercentage = this.setMatchPercentage.bind(this);
    this.incrementStage = this.incrementStage.bind(this);
    this.getAvailableCities();
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

  setMatchPercentage(matchPercentage) {
    this.setState({ matchPercentage: Math.round(matchPercentage) });
  }

  getPollutionQuestion(pollutionStage) {
    console.log('GET Q', pollutionStage);
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

  async getAvailableCities() {
    let { availableCities } = this.state;
    const cities = await getCities();
    availableCities = availableCities.map(avail => {
      const city = cities.find(p => p.name === avail.name);
      avail.id = city.id;
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
    if(matchPercentage >= 80) {
        const newStageIndex = pollutionStageIndex + 1;
        console.log(newStageIndex);
        console.log(pollutionStages[newStageIndex]);
        const update = {
          pollutionStageIndex: newStageIndex
        }
        if(pollutionStages[newStageIndex]) {
          update.pollutionStage = pollutionStages[newStageIndex]
        }
        this.setState(update)
    }
  }

  render() {
    const { stage, availableCities, selectedCity, results, pollutionStage, matchPercentage, pollutionStageIndex } = this.state;
    const scoreTotal = (accumulator, currentValue) => accumulator + currentValue.score;
    return (
      <div style={{ height: '100vh', position: "relative" }} className={stage !== 'MAP' ? 'texture' : ''}>
        {stage === 'START' ?
          <Container style={{ maxWidth: '50%', paddingTop: '20vh' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '60px' }}>Face the Music</h1>
            <h3 style={{ textAlign: 'center', marginBottom: '80px' }}>Understand the impact of your city to tune into its inner song</h3>
            <Button
              variant="outline-info" size="lg" block
              onClick={() => { this.setState({ stage: 'SELECT' }) }}>
              Play
                </Button>
          </Container>
          : null}
        {stage === 'SELECT' ?
          <Container style={{ maxWidth: '50%', paddingTop: '20vh' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Choose your city</h2>
            {availableCities.map(city => (
              <Button
                variant="outline-info" size="lg" block
                style={{ marginBottom: '30px' }}
                onClick={() => { this.selectCity(city.id) }}>
                {city.name}
              </Button>
            ))}
          </Container>
          : null}
        {stage === 'MAP' ?
          <div>
            <CesiumMap style={{ position: "absolute", top: 0, left: 0 }} 
            className="map"
            selectedCity={selectedCity}
            setMatchPercentage={this.setMatchPercentage}
            onComplete={this.mapComplete}
            stageIndex={pollutionStageIndex}/>,
            <div className='hud'>
              <h2 className='question'>{this.getPollutionQuestion(pollutionStage)}</h2>
              <canvas className="waves" id="waves" />
              <div className='sideBox leftBox'>
                <div>{`${matchPercentage}%`}
                <div className='bottom-text'>Sync</div>
                </div>
              </div>
              <div onClick={this.incrementStage} className={'sideBox rightBox ' + (matchPercentage >= 80 ? 'rightBoxEnable' : 'rightBoxDisable')}><i className="fa fa-arrow-right"></i></div>
            </div>
            <div className="circle circle-center"></div>
      </div>
          : null}
        {stage === 'SUMMARY' ?
          <Container style={{ maxWidth: '50%', paddingTop: '20vh' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Results</h2>
            <ListGroup>
              {results.map(result => (
                <ListGroup.Item
                  variant={result.score > 90 ? 'warning' : 'success'}
                >
                  <h2>{this.getPollutionLabel(result.stage)}</h2>
                  <h3>{`${result.name}: ${Math.round(result.score)}% match`}</h3>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <h2 style={{ textAlign: 'center', marginTop: '40px' }}>{`Score ${Math.round(results.reduce(scoreTotal, 0) / results.length)}`}</h2>
          </Container>
          : null}
      </div>);
  }
}