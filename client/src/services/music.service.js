import { Howl } from 'howler';

import rainforest from '../assets/sounds/ecosystem/rainforest.m4a';
import africa from '../assets/sounds/ecosystem/africa.m4a';
import ocean from '../assets/sounds/ecosystem/ocean.m4a';

import factorySounds from '../assets/sounds/pollution/factory.mp3';
import trafficSounds from '../assets/sounds/pollution/traffic.mp3';
import fireSounds from '../assets/sounds/pollution/fire.mp3';

const niceSongs = {
  'African Savannah': new Howl({
    src: [africa],
    loop: true,
  }),
  'Amazon Rainforest': new Howl({
    src: [rainforest],
    loop: true,
  }),
  'Great Barrier Reef': new Howl({
    src: [ocean],
    loop: true,
  }),
};

const pollutionTracks = [
  {
    howler: new Howl({
      src: [factorySounds],
      loop: true,
    }),
    volumeModifier: 1/6,
  },
  {
    howler: new Howl({
      src: [trafficSounds],
      loop: true,
    }),
    volumeModifier: 1/2,
  },
  {
    howler: new Howl({
      src: [fireSounds],
      loop: true,
    }),
    volumeModifier: 1/2,
  },
];

const volumes = [
  0.7,
  0.7,
  0.7,
];

let currentPlayingNiceSong;

const average = arr => arr.reduce((sum, x) => sum + x) / arr.length;

export const startNiceMusic = (location) => {
  if(!niceSongs[location].playing()) {
    if (currentPlayingNiceSong) {
      niceSongs[currentPlayingNiceSong].stop();
    }

    niceSongs[location].play();
    niceSongs[location].fade(0, 1, 4000);
    niceSongs[location].once('play', () => currentPlayingNiceSong = location);
  }
};

export const startPollutedMusic = () => {
  pollutionTracks.forEach(({ howler, volumeModifier }) => {
    if (!howler.playing()) {
      howler.play();
      howler.volume(volumeModifier);
    }
  });

}

export const adjustSounds = (stageNumber, score) => {
  const { howler, volumeModifier } = pollutionTracks[stageNumber]
  howler.volume((score) * volumeModifier);
  volumes[stageNumber] = score;
  niceSongs[currentPlayingNiceSong].volume(1 - average(volumes));
}
