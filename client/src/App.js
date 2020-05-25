import React, { Suspense, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import './App.css';
import WelcomePage from './components/WelcomePage';
import ResultsPage from './components/ResultsPage';
import {
  pollutionStages,
  dataOfCleanestCities,
  getPollutionQuestion,
  songLocations,
} from './utils/utils';

const SelectPage = React.lazy(() => import('./components/SelectPage'));
const CesiumMap = React.lazy(() => import('./components/CesiumMap'));

const matchRequirement = 100;

const GAME_STATES = {
  WELCOME: 'WELCOME',
  SELECT: 'SELECT',
  PLAYING: 'PLAYING',
  SUMMARY: 'SUMMARY',
}

const getMatchPctColor = (matchPercentage) =>
  `rgb(${((matchPercentage / 100)) * 220}, ${(1 - (matchPercentage / 100)) * 220}, 0, 1)`;

export default () => {
  const [gameState, setGameState] = useState(GAME_STATES.WELCOME);
  const [pollutionStage, setPollutionStage] = useState();
  const [pollutionStageIndex, setPollutionStageIndex] = useState(-1);
  const [songLocation, setSongLocation] = useState();
  const [currentLocation, setCurrentLocation] = useState();
  const [matchPercentage, setMatchPercentage] = useState(0);
  const [results, setResults] = useState([]);
  const [cameraLocation, setCameraLocation] = useState(songLocations[0].cameraLocation);

  const updateMatchPct = (matchPercentage, name) => {
    setMatchPercentage(Math.round(matchPercentage));
    setCurrentLocation(name);
  };

  const selectCity = (city) => {
    setSongLocation(city);
    setCameraLocation(city.cameraLocation);
  };

  const gameComplete = (results) => {
    setGameState(GAME_STATES.SUMMARY);
    setResults(results);
  };

  const incrementStage = () => {
    const newStageIndex = pollutionStageIndex + 1;
    setPollutionStageIndex(newStageIndex);
    if (pollutionStages[newStageIndex]) {
      setPollutionStage(pollutionStages[newStageIndex]);
    }
  };

  const startGame = () => {
    setGameState(GAME_STATES.PLAYING);
    setPollutionStage(pollutionStages[0]);
    setPollutionStageIndex(0);
  };

  const getStageProgressionBtn = () => (
    matchPercentage < matchRequirement
      ? (<i className="fa fa-arrow-right" style={{ color: getMatchPctColor(matchPercentage) }} onClick={incrementStage}></i>)
      : (<i className="fa fa-times" style={{ color: getMatchPctColor(matchPercentage) }}></i>)
  );

  const getHud = () => (
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
          {getStageProgressionBtn(matchRequirement)}
        </h3>
      </div>
      <div className="circle circle-center"></div>
    </div>
  );

  const getMapAndHud = () => (
    <div style={{ position: "absolute", top: 0, left: 0, width: '100%' }}>
      <Suspense fallback={null}>
        <CesiumMap style={{ position: "absolute", top: 0, left: 0 }}
          className="map"
          city={dataOfCleanestCities}
          cameraLocation={cameraLocation}
          updateMatchPct={updateMatchPct}
          onComplete={gameComplete}
          stageIndex={pollutionStageIndex}
        />
      </Suspense>
      {gameState === GAME_STATES.PLAYING ? getHud() : null}
    </div>
  );

  const getPage = () => {
    switch (gameState) {
      case GAME_STATES.WELCOME:
        return <WelcomePage onClick={() => setGameState(GAME_STATES.SELECT)} />;
      case GAME_STATES.SELECT:
      case GAME_STATES.PLAYING:
        // use the same cesium globe between SELECT and PLAYING pages
        return (
          <div>
            {getMapAndHud()}
            {gameState === GAME_STATES.SELECT
              ?
              (<Suspense fallback={null}>
                  <SelectPage songLocation={songLocation} selectCity={selectCity} startGame={startGame}/>
                </Suspense>)
              : null
            }
          </div>
        );
      case GAME_STATES.SUMMARY:
        return <ResultsPage results={results}/>;
      default:
        return null;
    }
  };

  return (
    <div style={{ height: '100%', position: "relative" }}>
      {getPage()}
    </div>
  );
};
