import React, { useState, useEffect } from 'react';
import Cesium from 'cesium';
import { Viewer, CameraFlyTo, } from 'cesium-react';
import clone from 'clone';
import waves from '../Waves';
import { getNearestCity } from '../../services/location.service';
import {
  adjustSounds,
  startPollutedMusic,
} from '../../services/music.service';

const targetWaves = [
  { wavelength: 286, amplitude: 110, phase: 0 },
  { wavelength: 286, amplitude: 110, phase: 0 },
  { wavelength: 286, amplitude: 110, phase: 0 },
]

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZTU3ZDZlZi1lNzdiLTQ4MjUtYTliYy1mOTg1MWUyM2JmYTUiLCJpZCI6MTcwMjgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzE0OTc5Mjl9.eAnkhlgA9PGlI4zGdof-ovkLOehYWKIGxdUe4zX9z_U';
const radiansToDegrees = (radians)  => radians * (180 / Math.PI);

const stages = ['co2', 'nitrousOxides', 'warming'];
const results = [];
let currentScore;
let timer;
let viewer;

const updateScore = async({ latitude, longitude }, targetCity, stageName, stageNumber, updateMatchPct) => {
  // console.log('targetCity', targetCity);
  if (stageNumber < 0) return;

  const latitudeDegrees = radiansToDegrees(latitude)
  const longitudeDegrees = radiansToDegrees(longitude)
  const nearestCity = await getNearestCity(longitudeDegrees, latitudeDegrees);

  const targetWave = targetWaves[stageNumber]
  const actualWave = clone(targetWave)

  const actualValue = nearestCity[stageName]
  const targetValue = targetCity[stageName]

  const score = 1 - (Math.min(actualValue, targetValue) / Math.max(actualValue, targetValue))
  const signedScore = actualValue / targetValue; // How far from target in positive or negative

  if (stageNumber % 2) {
    actualWave.amplitude *= signedScore - 0.7;
  } else {
    actualWave.wavelength /= signedScore - 0.85;
  }
  actualWave.score = signedScore - 1
  waves(actualWave, targetWave);
  currentScore = {
    name: nearestCity.name,
    score: (signedScore - 1) * 100,
    stage: stageName,
    data: nearestCity,
  };
  updateMatchPct(currentScore.score, currentScore.name);

  adjustSounds(stageNumber, score);
};

const updateCameraLocation = (city, stage, updateMatchPct, updateImmediately) => {
  const position = viewer.cesiumElement.scene.camera.positionCartographic;
  if (timer) {
    clearTimeout(timer);
  }
  if (updateImmediately) {
    updateScore(position, city, stages[stage], stage, updateMatchPct);
    return;
  }
  timer = setTimeout(
    () => updateScore(position, city, stages[stage], stage, updateMatchPct),
    1000,
  );
}

export default ({ city, stageIndex, updateMatchPct, onComplete, cameraLocation }) => {
  const [stage, setStage] = useState(-1);

  useEffect(() => {
    updateCameraLocation(city, stage, updateMatchPct, true)
    const { camera } = viewer.cesiumElement.scene;
    camera.percentageChanged = 0.01;
    camera.changed.addEventListener(
      () => updateCameraLocation(city, stage, updateMatchPct)
    );
  }, [stage, city, updateMatchPct, stageIndex]);

  useEffect(() => {
    if (stage !== stageIndex) {
      if (stage >= 0) {
        results.push(currentScore);
      }
      if (stageIndex >= stages.length) {
        onComplete(results);
      } else {
        setStage(stageIndex);
        updateCameraLocation(city, stage, updateMatchPct);
      }
    }
  }, [stage, city, updateMatchPct, stageIndex, onComplete]);

  if (stage >= 0) {
    startPollutedMusic();
  }

  return (
    <div>
      <Viewer
        style={{ height: '100vh' }}
        timeline={false}
        homeButton={false}
        infoBox={false}
        sceneModePicker={false}
        selectionIndicator={false}
        navigationHelpButton={false}
        fullscreenButton={false}
        ref={e => { viewer = e; }} >
        {stage < 0 ?
          <CameraFlyTo
            destination={Cesium.Cartesian3.fromDegrees(cameraLocation.longitude, cameraLocation.latitude, 25000000)}
            duration={3}
          />
          : null
        }
      </Viewer>
    </div>
  );
};
