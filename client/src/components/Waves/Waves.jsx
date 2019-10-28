import SineWaves from "sine-waves"

const maximumAmplitude = 200;

const waves = (actual, target) => {
  console.log(actual)
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
        lineWidth: 8,
        amplitude: Math.min(target.amplitude, maximumAmplitude),
        wavelength: target.wavelength,
        strokeStyle: 'rgba(25, 25, 25, 1)',
        type: x => 0,
      },
      {
        timeModifier: 1,   // This is multiplied againse `speed`
        lineWidth: 6,      // Stroke width
        amplitude: Math.min(actual.amplitude, maximumAmplitude),    // How tall is the wave
        wavelength: actual.wavelength,   // How long is the wave
        strokeStyle: `rgb(${(actual.score) * 255}, ${(1 - actual.score) * 255}, 0)`,
        type: x => Math.sin(x - actual.phase),
      },
    ],
   
  })
};
export default waves;