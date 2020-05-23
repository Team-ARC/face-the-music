import SineWaves from "sine-waves"

const maximumAmplitude = 250;

const waves = (actual, target) => {
  // console.log('[waves] actual', actual)
  // console.log('[waves] target', target)
  const targetWave = {
    timeModifier: 1,
    lineWidth: 8,
    amplitude: Math.min(target.amplitude, maximumAmplitude) / 2.5,
    wavelength: target.wavelength,
    strokeStyle: 'rgba(25, 25, 25, 1)',
    type: x => 0,
  };
  const actualWave = {
    timeModifier: 1,   // This is multiplied against `speed`
    lineWidth: 2,      // Stroke width
    amplitude: Math.min(actual.amplitude, maximumAmplitude) / 2.5,
    wavelength: actual.wavelength,   // How long is the wave
    strokeStyle: `rgb(${(actual.score) * 255}, ${(1 - actual.score) * 255}, 0)`,
    type: x => Math.sin(x - actual.phase),
  };
  new SineWaves({
    // Canvas Element
    el: document.getElementById('waves'),

    // General speed of entire wave system
    speed: 2,

    // How many degress should we rotate all of the waves
    rotate: 0,

    // Ease function from left to right
    ease: 'SineInOut',

    // Specific how much the width of the canvas the waves should be
    // This can either be a number or a percent
    waveWidth: '100%',

    // An array of wave options
    waves: [
      // targetWave,
      actualWave,
      {
        ...actualWave,
        timeModifier: actualWave.timeModifier * 1.25,
      },
      {
        ...actualWave,
        timeModifier: actualWave.timeModifier * 1.5,
      },
    ],
  })
};
export default waves;
