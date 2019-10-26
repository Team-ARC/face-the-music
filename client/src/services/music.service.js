import {Howl, Howler} from 'howler';
import nice_song from '../assets/rainforest2.m4a'
import factorySounds from '../assets/factory.mp3'
import trafficSounds from '../assets/traffic.mp3'
import fireSounds from '../assets/fire.mp3'

const pollutionTracks = [
  {
    howler: new Howl({
      src: [factorySounds],
      loop: true,
    }),
    volumeModifier: 1/8,
  },
  {
    howler: new Howl({
      src: [trafficSounds],
      loop: true,
    }),
    volumeModifier: 1,
  },
  {
    howler: new Howl({
      src: [fireSounds],
      loop: true,
    }),
    volumeModifier: 1/2,
  },
];

const niceSong = new Howl({
  src: [nice_song],
  loop: true,
});

const volumes = [
  0.7,
  0.7,
  0.7,
];

const average = arr => arr.reduce((sum, x) => sum + x) / arr.length;

export const initiateNiceMusic = () => {
  if(!niceSong.playing()) {
    niceSong.play();
  }
};

export const initiatePollutedMusic = () => {
  pollutionTracks.forEach(({ howler, volumeModifier }) => {
    howler.play();
    howler.volume(volumeModifier);
  });
  
}

export const playPlayerBasedOnScoreAndStage = (stageNumber, score) => {
  const { howler, volumeModifier } =  pollutionTracks[stageNumber]
  howler.volume(score * volumeModifier);
  volumes[stageNumber] = score;
  niceSong.volume(0.7 - average(volumes));
}
