import React from 'react';
import Cesium from "cesium"
import { Viewer, CameraFlyTo, } from "cesium-react";
import waves from '../Waves'
import { getNearestCity } from '../../services/location.service';
import clone from 'clone';
import {
  playPlayerBasedOnScoreAndStage,
  initiateNiceMusic,
  initiatePollutedMusic,
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
      stage: -1,
      stages: ['co2', 'nitrousOxides', 'warming'],
      city: props.city,
    }
  }

  async getScore({ latitude, longitude }, targetCity, stageName, stageNumber) {
    targetCity = {
      "co2": 24086000,
      "warming": 0.72,
      "nitrousOxides": 163,
    }
    if(stageNumber < 0) return;

    const latitudeDegrees = radians_to_degrees(latitude)
    const longitudeDegrees = radians_to_degrees(longitude)
    const response = await getNearestCity(longitudeDegrees, latitudeDegrees);

    const targetWave = targetWaves[stageNumber]
    const actualWave = clone(targetWave)

    const actualValue = response[0][stageName]
    const targetValue = targetCity[stageName]

    let score = 1 - (Math.min(actualValue, targetValue) / Math.max(actualValue, targetValue))

    const signedScore = actualValue / targetValue // How far from target in positive or negative

    switch (stageNumber) {
      case 0:
        actualWave.amplitude *= signedScore;
        break;
      case 1:
        actualWave.wavelength /= signedScore
        break;
      default:
        break;
    }
    actualWave.score = score
    waves(actualWave, targetWave);
    this.currentScore = { name: response[0].name, score: score * 100, stage: stageName, data: response[0] };
    this.props.setMatchPercentage(this.currentScore.score, this.currentScore.name);

    playPlayerBasedOnScoreAndStage(stageNumber, score);
  }

  getCameraLocation(override = false) {
    const camera = this.viewer.cesiumElement.scene.camera;
    const position = camera.positionCartographic;
    if(override) {
      return this.getScore(position, this.props.city, this.state.stages[this.state.stage], this.state.stage);
    }
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => this.getScore(position, this.props.city, this.state.stages[this.state.stage], this.state.stage), 1000);
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
      if (this.state.stage >= 0) {
        this.results.push(this.currentScore);
      }
      if (stage >= this.state.stages.length) {
        this.props.onComplete(this.results);
      } else {
        this.setState({ stage: this.props.stageIndex }, () => {
        this.getCameraLocation(true);
        });
      }
    }
  }

  render() {
    initiateNiceMusic(this.props.city.name);
    if (this.state.stage >= 0) {
      initiatePollutedMusic();
    }
    return (
      <Viewer
        style={{ height: '100vh' }}
        timeline={false}
        homeButton={false}
        infoBox={false}
        sceneModePicker={false}
        selectionIndicator={false}
        navigationHelpButton={false}
        fullscreenButton={false}

        ref={e => { this.viewer = e; }} >
        { this.state.stage < 0 ? 
          <CameraFlyTo
            destination={Cesium.Cartesian3.fromDegrees(this.props.cameraLocation.longitude, this.props.cameraLocation.latitude, 25000000)}
            duration={3}
          />
          : null
        
        }
      </Viewer>
    );
  }
}

export default CesiumMap;
