import SineWaves from "sine-waves"

const waves = (actual, target) => {
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
        amplitude: target.amplitude,
        wavelength: target.wavelength,
        strokeStyle: 'rgba(100, 100, 100, 1)'
      },
      {
        timeModifier: 1,   // This is multiplied againse `speed`
        lineWidth: 2,      // Stroke width
        amplitude: actual.amplitude,    // How tall is the wave
        wavelength: actual.wavelength,   // How long is the wave
        strokeStyle: `rgba(${(1-actual.score) * 255}, ${actual.score * 255}, 0, 1)`,
        type: x => Math.sin(x - actual.phase),
      },
    ],
   
  })
};
export default waves;