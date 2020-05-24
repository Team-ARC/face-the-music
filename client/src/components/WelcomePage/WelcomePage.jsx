import React from 'react';
import { Button } from 'react-bootstrap';

import logoImg from '../../assets/logo.png';
import {
  earthBackground,
  fullscreen,
  centerFlex,
  logo,
  margin,
} from './WelcomePage.module.css';
import useWindowDimensions from '../../hooks/useWindowDimensions';

const widthOfEarthBackground = 800;

export default ({ onClick }) => {
  const { width } = useWindowDimensions();
  const showEarthBackground = width < widthOfEarthBackground;
  return (
    <div className={`${fullscreen} ${centerFlex} ${showEarthBackground ? earthBackground : ''}`}>
      {showEarthBackground ? null : <img className={`${logo} ${margin}`} src={logoImg} alt="Logo" />}
      <h1 className={margin}>Face The Music</h1>
      <h3 className={margin}>Rediscover the Earth's natural music</h3>
      <Button
        className={`button ${margin}`}
        variant="outline-info" size="lg"
        onClick={onClick}>
        Play
      </Button>
    </div>
  );
};
