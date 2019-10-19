import React from 'react';
import Cesium from "cesium"
import { Viewer } from "cesium-react";

Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZTU3ZDZlZi1lNzdiLTQ4MjUtYTliYy1mOTg1MWUyM2JmYTUiLCJpZCI6MTcwMjgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzE0OTc5Mjl9.eAnkhlgA9PGlI4zGdof-ovkLOehYWKIGxdUe4zX9z_U";

class CesiumMap extends React.PureComponent {

  render() {
    return (
      <Viewer 
        baseLayerPicker={false}
        timeline={false}
        homeButton={false}
        infoBox={false}
        sceneModePicker={false}
        selectionIndicator={false}
        navigationHelpButton={false}
        fullscreenButton={false}
        
        ref={e => { this.viewer = e; }} >
        <button onClick={this.inspectCamera}>Inspect camera</button>
      </Viewer>
    );
  }

  inspectCamera = () => {
    const camera = this.viewer.cesiumElement.scene.camera;
    console.log("position", camera.positionCartographic);
  }
}

export default CesiumMap;
