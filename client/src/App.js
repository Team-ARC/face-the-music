import React from 'react';
import CesiumMap from './components/CesiumMap'
import { getCities } from './services/location.service'
import { Button, Container, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      stage: 'START',
      selectedCity: null,
      results: [],
      cities: [],
      availableCities: [{ name: 'London' }, { name: 'Sydney' }, { name: 'New York' }, { name: 'Paris' }]
    }
    this.selectCity = this.selectCity.bind(this);
    this.mapComplete = this.mapComplete.bind(this);
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

  async getAvailableCities() {
    let { availableCities } = this.state;
    const cities = await getCities();
    availableCities = availableCities.map(avail => {
      const city = cities.find(p => p.name === avail.name);
      avail.id = city.id;
      return avail;
    })
    this.setState({ cities, availableCities });
    console.log(availableCities);
  }

  selectCity(id) {
    const city = this.state.cities.find(p => p.id === id);
    this.setState({ selectedCity: city, stage: 'MAP' });
  }

  mapComplete(results) {
    this.setState({ stage: 'SUMMARY', results });
  }

  render() {
    const { stage, availableCities, selectedCity, results } = this.state;
    const scoreTotal = (accumulator, currentValue) => accumulator + currentValue.score;
    return (
      <div style={{ height: '100vh', position: "relative" }}>
        {stage === 'START' ?
          <Container className="align-middle" style={{ maxWidth: '50%', marginTop: '20vh' }}>
            <h1 style={{ textAlign: 'center', 'margin-bottom': '60px' }}>Face the Music</h1>
            <h3 style={{ textAlign: 'center', 'margin-bottom': '80px' }}>Understand the impact of your city ton tune into its inner song</h3>
            <Button
              variant="primary" size="lg" block
              onClick={() => { this.setState({ stage: 'SELECT' }) }}>
              Play
                </Button>
          </Container>
          : null}
        {stage === 'SELECT' ?
          <Container className="align-middle" style={{ maxWidth: '50%', marginTop: '20vh' }}>
            <h2 style={{ textAlign: 'center', 'margin-bottom': '40px' }}>Choose your city</h2>
            {availableCities.map(city => (
              <Button
                variant="primary" size="lg" block
                style={{ marginBottom: '30px' }}
                onClick={() => { this.selectCity(city.id) }}>
                {city.name}
              </Button>
            ))}
          </Container>
          : null}
        {stage === 'MAP' ?
          <div>
            <CesiumMap style={{ height: "100vh !important", position: "absolute", top: 0, left: 0 }} className="map" selectedCity={selectedCity} onComplete={this.mapComplete} />,
        <canvas style={{ position: "absolute", top: "75vh", left: 0, height: "25vh", width: "100vw" }} className="waves" id="waves" />
            <div style={{ position: "absolute", top: 770 / 2 - 4, left: 1440 / 2 - 4, height: "8px", width: "8px" }} className="circle"></div>,
      </div>
          : null}
        {stage === 'SUMMARY' ?
          <Container className="align-middle" style={{ maxWidth: '50%', marginTop: '20vh' }}>
            <h2 style={{ textAlign: 'center', 'margin-bottom': '40px' }}>Results</h2>
            <ListGroup>
              {results.map(result => (
                <ListGroup.Item
                  variant={result.score > 90 ? 'warning' : 'success'}
                >
                  <h2>{this.getPollutionLabel(result.stage)}</h2>
                  <h3>{`${result.name}: ${result.score}% match`}</h3>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <h2 style={{ textAlign: 'center', 'marginTop': '40px' }}>{`Score ${results.reduce(scoreTotal, 0) / results.length}`}</h2>
          </Container>
          : null}
      </div>);
  }
}