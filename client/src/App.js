import React from 'react';
import CesiumMap from './components/CesiumMap'
import { getCities } from './services/location.service'
import './App.css'
export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      stage: 'SELECT',
      selectedCity: null,
      results: [],
      cities: [],
      availableCities: [{ name: 'London'}, { name: 'Sydney' }, { name: 'New York' }, { name: 'Paris'}]
    }
    this.selectCity = this.selectCity.bind(this);
    this.mapComplete = this.mapComplete.bind(this);
    this.getAvailableCities();
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
    return (
    <div style={{vh: "100%", position: "relative"}}>
      { stage === 'SELECT' ?
      <div>
        { availableCities.map(city => (
          <div
            style={{cursor: 'pointer'}}
            onClick={() => {this.selectCity(city.id)}}
          >
            <h2>{city.name}</h2>
          </div>
        )) }
      </div>
      : null }
      { stage === 'MAP' ? 
      <div>
        <CesiumMap style={{height: "100vh !important", position: "absolute", top:0, left:0}} className="map" selectedCity={selectedCity} onComplete={this.mapComplete}/>,
        <canvas style={{position: "absolute", top:"75vh", left:0, height:"25vh", width: "100vw"}}className="waves" id ="waves" />
        <div style={{position: "absolute", top:770 / 2 - 4, left:1440/2 - 4, height:"8px", width: "8px"}} className="circle"></div>,
      </div>
      : null}
      { stage === 'SUMMARY' ?
      <div>
        { results.map(result => (
          <div>
            <h2>{`${result.stage} - ${result.name}`}</h2>
            <h3>{result.score}</h3>
          </div>
        )) }
      </div>
      : null }
    </div>);
  }
}