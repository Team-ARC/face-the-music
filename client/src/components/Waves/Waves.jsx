import SineWaves from "sine-waves"

const waves = () => {
  new SineWaves({
    // Canvas Element
    el: document.getElementById('waves'),
   
    // General speed of entire wave system
    speed: 8,
   
    // How many degress should we rotate all of the waves
    rotate: 0,
   
    // Ease function from left to right
    ease: 'Linear',
   
    // Specific how much the width of the canvas the waves should be
    // This can either be a number or a percent
    waveWidth: '95%',
   
    // An array of wave options
    waves: [
      {
        timeModifier: 1,   // This is multiplied againse `speed`
        lineWidth: 3,      // Stroke width
        amplitude: 150,    // How tall is the wave
        wavelength: 200,   // How long is the wave
        segmentLength: 20, // How smooth should the line be
        strokeStyle: 'rgba(255, 0, 0, 1)', // Stroke color and opacity
        type: 'sine'       // Wave type
      },
      {
        timeModifier: 1,
        lineWidth: 2,
        amplitude: 150,
        wavelength: 100,
        strokeStyle: 'rgba(0, 255, 255, 1)'
      }
    ],
   
  })
};
export default waves;