import Tone from 'tone';
import {Howl, Howler} from 'howler';
import soundfile_perfect from '../assets/rocket_man_elton_john.mp3'
import soundfile_slow_30pct from '../assets/rocket_man_slow_30pct.mp3'
import soundfile_slow_70pct from '../assets/rocket_man_slow_70pct.mp3'

let startTime;
let timeSongStarted;

// const highPass = new Tone.Filter(1600, 'highpass');
// const dist = new Tone.Distortion();
// const reverb = new Tone.Reverb();
// const gate = new Tone.Gate(-30, 0.5, 0.3);
// const pow = new Tone.Pow(3);
// const phaser = new Tone.Phaser({
//   'frequency' : 5,
//   'octaves' : 1,
//   'baseFrequency' : 400,
// });
// const pitchShiftDown = new Tone.PitchShift(-3);

const players = [
  [
    {
      player: (new Tone.Player(soundfile_slow_30pct)),
      transformations: [
        (new Tone.Filter(50, 'lowpass')),
        (new Tone.EQ3(10, -1000, -1000)),
        (new Tone.PitchShift(10)),
        (new Tone.Freeverb()),
      ],
    },
    {
      player: (new Tone.Player(soundfile_slow_30pct)),
      transformations: [
        (new Tone.Filter(400, 'lowpass')),
        (new Tone.EQ3(10, -1000, -1000)),
        (new Tone.PitchShift(10)),
        (new Tone.Freeverb()),
      ],
    },
  ],
  [
    {
      player: (new Tone.Player(soundfile_slow_30pct)),
      transformations: [
        (new Tone.PitchShift(10)),
        (new Tone.Freeverb()),
      ],
    },
    {
      player: (new Tone.Player(soundfile_slow_30pct)),
      transformations: [
        (new Tone.PitchShift(5)),
        (new Tone.Freeverb()),
      ],
    },
  ],
  // [
  //   {
  //     player: (new Tone.Player(soundfile_slow_70pct, () => console.log('Player 1 loaded'))),
  //     transformations: [(new Tone.Freeverb())],
  //   },
  //   {
  //     player: (new Tone.Player(soundfile_slow_30pct, () => console.log('Player 2 loaded'))),
  //     transformations: [(new Tone.Freeverb())],
  //   },
  // ],
];

const originalPlayer = new Tone.Player(soundfile_perfect, () => {
  console.log('original player loaded');
});

const loadPlayers = (players) => {
  for (const transformationCategory of players) {
    for (const playerInfo of transformationCategory) {
      Tone.Master.chain(
        playerInfo.player,
        ...playerInfo.transformations,
      );
    }
  }
  Tone.Master.chain(originalPlayer);
}

loadPlayers(players);

export const startFirstPlayer = () => {
  const player = getPlayer(0, 0);
  const offset = 0;
  timeSongStarted = Tone.now();
  playOnlyPlayer(player, offset);
}

export const stopAllPlayers = () => {
  for (const transformationCategory of players) {
    transformationCategory.forEach(infoObj => infoObj.player.stop());
  }
  originalPlayer.stop();
}

const getPlayer = (transformationIndex, playerIndex) => players[transformationIndex][playerIndex].player;

const playOnlyPlayer = (player, offset) => {
  stopAllPlayers();
  startTime = Tone.now(); // Keeps players in sync
  if (offset === undefined) offset = startTime;
  // console.log('startTime ' + startTime);
  // console.log('offset ' + offset);

  player.start(startTime, offset);
};

const playOnlyPlayerAtIndex = (transformationIndex, playerIndex) => {
  const player = getPlayer(transformationIndex, playerIndex);
  playOnlyPlayer(player);
};

export const playOnlyOriginalPlayer = () => {
  playOnlyPlayer(originalPlayer);
}

const howlerSound = new Howl({
  src: [soundfile_perfect],
});
let isHowlerPlaying = false;

export const playPlayerBasedOnScoreAndStage = (stageNumber, score) => {

  if (stageNumber <= 1) {
    const transformationIndex = stageNumber;
    console.log('transformationIndex ' + transformationIndex);
    console.log('score ' + score);
    const playerIndex = Math.round(score);
    console.log('playerIndex ' + playerIndex);
    playOnlyPlayerAtIndex(transformationIndex, playerIndex);
  } else {
    stopAllPlayers();
    if (!isHowlerPlaying) {
      isHowlerPlaying = true;
      const offset = Tone.now() - timeSongStarted;
      howlerSound.seek(offset);
      howlerSound.play();
    }
    howlerSound.rate(0.5 + score*0.5);
  }
}
