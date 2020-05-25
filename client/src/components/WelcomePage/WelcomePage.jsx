import React from 'react';
import { Button } from 'react-bootstrap';

import logoImg from '../../assets/logo.png';
import earthBackgroundImg from '../../assets/earthTopCombinedCrop.gif';
import {
  earthBackground,
  fullscreen,
  centerFlex,
  logo,
  margin,
  layer1,
} from './WelcomePage.module.css';
import useWindowDimensions from '../../hooks/useWindowDimensions';

const widthOfEarthBackground = 800;
const earthBackgroundComponent = (
  <img
    src={earthBackgroundImg}
    className={earthBackground}
    alt={''}
  />
);

export default ({ onClick }) => {
  const { width } = useWindowDimensions();
  const showEarthBackground = width < widthOfEarthBackground;
  return (
    <div className={`${fullscreen} ${centerFlex}`}>
      {showEarthBackground ? null : <img className={`${logo} ${margin} ${layer1}`} src={logoImg} alt="Logo" />}
      <h1 className={`${margin} ${layer1}`}>Face The Music</h1>
      <h3 className={`${margin} ${layer1}`}>Rediscover the Earth's natural music</h3>
      <Button
        className={`button ${`${margin} ${layer1}`}`}
        variant="outline-info" size="lg"
        onClick={onClick}>
        Play
      </Button>
      {showEarthBackground ? earthBackgroundComponent : null}
    </div>
  );
};
