import React from 'react';
import Cesium from "cesium"
import { Viewer } from "cesium-react";
import waves from '../Waves'
import { getNearestCity } from '../../services/location.service';

Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZTU3ZDZlZi1lNzdiLTQ4MjUtYTliYy1mOTg1MWUyM2JmYTUiLCJpZCI6MTcwMjgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzE0OTc5Mjl9.eAnkhlgA9PGlI4zGdof-ovkLOehYWKIGxdUe4zX9z_U";

class CesiumMap extends React.PureComponent {

  constructor() {
    super();
    this.state = {
      started: false,
      stage: 0,
      stages: ['co2', 'landfill', 'warming']
    }

  }

  componentDidMount() {
    if(!this.state.started) {
      waves();
      this.setState({ started: true });
    }
    function print(data) {
      console.log(data);
    }
    this.viewer.cesiumElement.scene.camera.changed.addEventListener(() => {
      const camera = this.viewer.cesiumElement.scene.camera;
      const position = camera.positionCartographic;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(async () => {
        const { latitude, longitude } = position
        const response = await getNearestCity(latitude, longitude);

        console.log(response);
      }, 3000);
    });
  }

  render() {
    return (
      <Viewer 
        // baseLayerPicker={false}
        timeline={false}
        homeButton={false}
        infoBox={false}
        sceneModePicker={false}
        selectionIndicator={false}
        navigationHelpButton={false}
        fullscreenButton={false}
        
        ref={e => { this.viewer = e; }} >
        {/* <button onClick={this.inspectCamera}>Inspect camera</button> */}
      </Viewer>
    );
  }
  inspectCamera = () => {
    const camera = this.viewer.cesiumElement.scene.camera;
    console.log("position", camera.positionCartographic);
  }
}

export default CesiumMap;
