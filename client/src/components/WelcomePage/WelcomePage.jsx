import React from 'react';
import { Container, Button } from 'react-bootstrap';

import logo from '../../assets/logo.png';

export default ({ onClick }) => (
  <Container
    fluid
    style={{
      flexFlow: 'column',
      textAlign: 'center',
      height: '96vh',
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      padding: '2vh 0',
    }}
    >
    <img className="logo" src={logo} alt="Logo" />
    <h1 style={{}}>Face The Music</h1>
    <h3 style={{}}>Rediscover the Earth's natural songs</h3>
    <Button
      className={'button'}
      variant="info" size="lg"
      onClick={onClick}>
      Play
    </Button>
  </Container>
);
