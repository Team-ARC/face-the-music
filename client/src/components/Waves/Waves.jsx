import SineWaves from "sine-waves"

const waves = (wavelength) => {
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
    waveWidth: '100%',
   
    // An array of wave options
    waves: [
      {
        timeModifier: 1,
        lineWidth: 10,
        amplitude: 150,
        wavelength: 143,
        strokeStyle: 'rgba(100, 100, 100, 1)'
      },
      {
        timeModifier: 1,   // This is multiplied againse `speed`
        lineWidth: 2,      // Stroke width
        amplitude: 150,    // How tall is the wave
        wavelength: wavelength,   // How long is the wave
        strokeStyle: 'rgba(0, 255, 0, 1)', // Stroke color and opacity
      },
    ],
   
  })
};
export default waves;