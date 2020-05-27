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
import {
  fullscreen,
  hudTitle,
  hudBase,
  hudStatement,
  question,
  waves,
  circle,
  circleCenter,
} from './MapAndHud.module.css';

const SelectPage = React.lazy(() => import('./components/SelectPage'));
const CesiumMap = React.lazy(() => import('./components/CesiumMap'));

const MAX_PASS_MATCH_PCT = 150;

const GAME_STATES = {
  WELCOME: 'WELCOME',
  SELECT: 'SELECT',
  PLAYING: 'PLAYING',
  SUMMARY: 'SUMMARY',
}

const getMatchPctColor = (matchPercentage) =>
  `rgb(${((matchPercentage / 100)) * 220}, ${(1 - (matchPercentage / 100)) * 220}, 0, 1)`;

const getMatchPctStyle = (matchPercentage) => ({
  fontWeight: 'bold',
  color: getMatchPctColor(matchPercentage),
});

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

  const getStageProgressionBtn = (maxPassMatchPct) => (
    matchPercentage < maxPassMatchPct
      ? (<i className="fa fa-arrow-right" style={{ color: getMatchPctColor(matchPercentage) }} onClick={incrementStage}></i>)
      : (<i className="fa fa-times" style={{ color: getMatchPctColor(matchPercentage) }}></i>)
  );

  const getHud = () => (
    <div>
      <div className={hudTitle}>
        <h2 className={question}>{getPollutionQuestion(pollutionStage)}</h2>
      </div>
      <div className={hudBase}>
        <canvas className={waves} id="waves" />
        <h3 className={`${question} ${hudStatement}`}>
          <span style={getMatchPctStyle(matchPercentage)}>{currentLocation}</span>
          {' is '}
          <span style={getMatchPctStyle(matchPercentage)}>{`${matchPercentage}%`}</span>
          {' worse than the best city '}
          {getStageProgressionBtn(MAX_PASS_MATCH_PCT)}
        </h3>
      </div>
      <div className={`${circle} ${circleCenter}`}></div>
    </div>
  );

  const getMapAndHud = () => (
    <div className={fullscreen}>
      <Suspense fallback={null}>
        <CesiumMap
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
            ? (<Suspense fallback={null}>
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
