import React from 'react';
import Cesium from "cesium"
import { Viewer } from "cesium-react";
import waves from '../Waves'
import { getNearestCity } from '../../services/location.service';
import clone from 'clone';
import {
  playPlayerBasedOnScoreAndStage,
  playOnlyOriginalPlayer,
  startFirstPlayer,
  // stopAllPlayers,
} from '../../services/music.service';

const targetWaves = [
  { wavelength: 286, amplitude: 110, phase: 0 },
  { wavelength: 286, amplitude: 110, phase: 0 },
  { wavelength: 143, amplitude: 110, phase: 0 },
]

Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZTU3ZDZlZi1lNzdiLTQ4MjUtYTliYy1mOTg1MWUyM2JmYTUiLCJpZCI6MTcwMjgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzE0OTc5Mjl9.eAnkhlgA9PGlI4zGdof-ovkLOehYWKIGxdUe4zX9z_U";
function radians_to_degrees(radians) {
  var pi = Math.PI;
  return radians * (180 / pi);
}

class CesiumMap extends React.PureComponent {
  results = [];
  currentScore = null;

  constructor(props) {
    super();
    this.state = {
      started: false,
      stage: 0,
      stages: ['co2', 'landfill', 'warming'],
      city: props.selectedCity,
    }
    startFirstPlayer();
  }

  async getScore({ latitude, longitude }, targetCity, stageName, stageNumber) {
    const latitudeDegrees = radians_to_degrees(latitude)
    const longitudeDegrees = radians_to_degrees(longitude)
    const response = await getNearestCity(longitudeDegrees, latitudeDegrees);

    const targetWave = targetWaves[stageNumber]
    const actualWave = clone(targetWave)

    const actualValue = response[0][stageName]
    const targetValue = targetCity[stageName]
    const score = Math.min(actualValue, targetValue) / Math.max(actualValue, targetValue)
    const signedScore = actualValue / targetValue // How far from target in positive or negative

    switch (stageNumber) {
      case 0:
        actualWave.amplitude *= signedScore;
        break;
      case 1:
        actualWave.phase = 5 * (1 - signedScore)
        break;
      case 2:
        actualWave.wavelength /= signedScore
        break;
      default:
        break;
    }
    actualWave.score = score
    waves(actualWave, targetWave);
    this.currentScore = { name: response[0].name, score: score * 100, stage: stageName, data: response[0] };
    this.props.setMatchPercentage(this.currentScore.score, this.currentScore.name);

    playPlayerBasedOnScoreAndStage(score, stageNumber);
  }

  getCameraLocation(override = false) {
    const camera = this.viewer.cesiumElement.scene.camera;
    const position = camera.positionCartographic;
    if(override) {
      return this.getScore(position, this.state.city, this.state.stages[this.state.stage], this.state.stage);
    }
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => this.getScore(position, this.state.city, this.state.stages[this.state.stage], this.state.stage), 1000);
  }

  componentDidMount() {
    this.viewer.cesiumElement.scene.camera.percentageChanged = 0.01;
    if (!this.state.started) {
      waves({ wavelength: 300, amplitude: 110, speed: 1 }, { wavelength: 143, amplitude: 110, speed: 1 });
      this.setState({ started: true });
      this.getCameraLocation(true);
    }
    this.viewer.cesiumElement.scene.camera.changed.addEventListener(() => this.getCameraLocation());
  }

  componentDidUpdate() {
    if (this.state.stage !== this.props.stageIndex) {
      const stage = this.props.stageIndex;
      this.results.push(this.currentScore);
      if (stage >= this.state.stages.length) {
        playOnlyOriginalPlayer();
        this.props.onComplete(this.results);
      } else {
        this.setState({ stage: this.props.stageIndex }, () => {
        this.getCameraLocation(true);
        });
      }
    }
  }

  render() {
    return (
      <Viewer
        style={{ height: '90vh' }}
        timeline={false}
        homeButton={false}
        infoBox={false}
        sceneModePicker={false}
        selectionIndicator={false}
        navigationHelpButton={false}
        fullscreenButton={false}

        ref={e => { this.viewer = e; }} >
      </Viewer>
    );
  }
}

export default CesiumMap;
