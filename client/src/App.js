import React from 'react';
import CesiumMap from './components/CesiumMap'
import waves from './components/Waves'
import './App.css'
export default class App extends React.Component {
  
  render() {
    return (<div style={{vh: "100%", position: "relative"}}>
      <CesiumMap style={{height: "100vh !important", position: "absolute", top:0, left:0}} className="map" />,
      <canvas style={{position: "absolute", top:"75vh", left:0, height:"25vh", width: "100vw"}}className="waves" id ="waves" />
      <div style={{position: "absolute", top:770 / 2 - 4, left:1440/2 - 4, height:"8px", width: "8px"}} class="circle"></div>,
    </div>);
  }
  componentDidMount() {
    waves();
  }
  

}