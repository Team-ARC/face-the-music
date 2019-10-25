import {Howl, Howler} from 'howler';
import nice_song from '../assets/rocket_man_elton_john.mp3'
import pollution_noise from '../assets/david_bowie_space_oddity.mp3'

let isHowlerPlaying = false;

const pollutionTrack = new Howl({
  src: [pollution_noise],
});

const niceSong = new Howl({
  src: [nice_song],
});


export const playPlayerBasedOnScoreAndStage = (stageNumber, score) => {
  if (stageNumber <= 0) {
    if (!isHowlerPlaying) {
      isHowlerPlaying = true;
      niceSong.play();
      niceSong.rate(0.5);
      pollutionTrack.play();
    }
    pollutionTrack.volume(score);
  } else {
    pollutionTrack.stop();
    const tempo = 0.5 + score*0.5;
    niceSong.rate(tempo);
  }
}
