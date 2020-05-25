import React from 'react';
import { Button } from 'react-bootstrap';

import earthBackgroundVid from '../../assets/earthTop.mp4';
import {
  earthBackground,
  fullscreen,
  centerFlex,
  margin,
  layer1,
} from './WelcomePage.module.css';

const earthBackgroundComponent = (
  <video autoPlay loop muted playsInline className={earthBackground}>
    <source src={earthBackgroundVid} type="video/mp4"/>
  </video>
);

const playButton = (onClick) => (
  <Button
    className={`button ${margin} ${layer1}`}
    variant="outline-light" size="lg"
    onClick={onClick}>
    Play
  </Button>
);

export default ({ onClick }) => {
  return (
    <div className={`${fullscreen} ${centerFlex}`}>
      <h1 className={`${margin} ${layer1}`}>Face The Music</h1>
      <h3 className={`${margin} ${layer1}`}>Rediscover the Earth's natural music</h3>
      {playButton(onClick)}
      {earthBackgroundComponent}
    </div>
  );
};
