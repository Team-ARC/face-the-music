import React from 'react';
import Cesium from "cesium"
import { Viewer } from "cesium-react";
import waves from '../Waves'
import { getNearestCity } from '../../services/location.service';


Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZTU3ZDZlZi1lNzdiLTQ4MjUtYTliYy1mOTg1MWUyM2JmYTUiLCJpZCI6MTcwMjgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzE0OTc5Mjl9.eAnkhlgA9PGlI4zGdof-ovkLOehYWKIGxdUe4zX9z_U";
function radians_to_degrees(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}

const calcScore = (results) => {
  if (results.length === 0) return 0;
  const total = results.reduce((subtotal, result) => subtotal + result.score, 0);
  return total / results.length;
}

class CesiumMap extends React.PureComponent {
  results = [];
  currentScore = null;

  async getScore({ latitude, longitude }, target, stage) {
    const latitudeDegrees = radians_to_degrees(latitude)
      const longitudeDegrees = radians_to_degrees(longitude)
      const response = await getNearestCity(longitudeDegrees, latitudeDegrees);

      const wavelength = (target[stage] + 1) * 143 / (1 + response[0][stage]);
      waves(wavelength);
      const score = wavelength < 143 ? wavelength / 1.43 : 14300 / wavelength
      console.log("target")
      console.log(target, target[stage])
      console.log("score")
      console.log(`${score}%`)
      this.currentScore = {name: response[0].name, score, stage};
  }

  constructor(props) {
    super();
    this.state = {
      started: false,
      stage: 0,
      stages: ['co2', 'landfill', 'warming'],
      city: props.selectedCity,
      onComplete: props.onComplete,
    }
  }

  getCameraLocation() {
    const camera = this.viewer.cesiumElement.scene.camera;
      const position = camera.positionCartographic;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => this.getScore(position, this.state.city, this.state.stages[this.state.stage]), 2000);
  }

  componentDidMount() {
    if(!this.state.started) {
      waves();
      this.setState({ started: true });
    }
    this.viewer.cesiumElement.scene.camera.changed.addEventListener(() => this.getCameraLocation());
  }

  render() {
    return [
        <button onClick={() => {
          this.state.stage += 1;
          this.results.push(this.currentScore);
          this.setState({score: calcScore(this.results)})
          console.log("this.state.score")
          console.log(this.state.score)
          if (this.state.stage >= this.state.stages.length) {
            this.state.onComplete(this.results);
          }
          this.getCameraLocation();
          console.log(this.results)
        }}>Inspect camera</button>,
        <h1>Score: {this.state.score}</h1>,
      <Viewer 
        // baseLayerPicker={false}
        timeline={false}
        homeButton={false}
        infoBox={false}
        sceneModePicker={false}
        selectionIndicator={false}
        navigationHelpButton={false}
        fullscreenButton={false}
        
        ref={e => { this.viewer = e; }} >
      </Viewer>
    ];
  }
  inspectCamera = () => {
    const camera = this.viewer.cesiumElement.scene.camera;
    console.log("position", camera.positionCartographic);
  }
}

export default CesiumMap;
