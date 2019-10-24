import {Howl, Howler} from 'howler';
import soundfile_perfect from '../assets/rocket_man_elton_john.mp3'

const howlerSound = new Howl({
  src: [soundfile_perfect],
});
let isHowlerPlaying = false;

export const playPlayerBasedOnScoreAndStage = (stageNumber, score) => {
  if (!isHowlerPlaying) {
    isHowlerPlaying = true;
    howlerSound.seek();
    howlerSound.play();
  }
  howlerSound.rate(0.5 + score*0.5);
}
