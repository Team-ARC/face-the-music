import React from 'react';
import { Button } from 'react-bootstrap';

import { songLocations } from '../../utils/utils';
import { startNiceMusic } from '../../services/music.service';

export default ({ songLocation, selectCity, startGame }) => (
  <div style={{
    position: 'absolute',
    height: '100vh',
    width: '100vw',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexFlow: 'column',
    textAlign: 'center',
  }}>
    <h2 className={'hud-title'}>Every ecosystem has a song. Choose one:</h2>
    <div style={{
      alignItems: 'center',
      flexFlow: 'column',
      display: 'flex',
    }} className={'center'}>
      {songLocations.map((city, i) => (
        <Button
          key={i}
          className={'button'}
          variant={songLocation && songLocation.name === city.name ? city.variant : `outline-${city.variant}`} size="lg"
          style={{ margin: '0.5rem' }}
          onClick={() => {
            selectCity(city);
            startNiceMusic(city.name);
          }}>
          {city.name}
        </Button>
      ))}
    </div>
    {songLocation ?
      <Button
        className={'button bottom'}
        variant={'outline-info'} size="lg"
        onClick={startGame}>
        Start
      </Button>
    : null}
  </div>
);
