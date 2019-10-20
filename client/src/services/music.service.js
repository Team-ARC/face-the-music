import Tone from 'tone';
import soundfile from '../assets/rocket_man_elton_john.mp3'

let startTime;

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
      player: (new Tone.Player(soundfile)),
      transformations: [
        (new Tone.Filter(50, 'lowpass')),
        (new Tone.EQ3(10, -1000, -1000)),
        (new Tone.PitchShift(12)),
        (new Tone.Freeverb()),
      ],
    },
    {
      player: (new Tone.Player(soundfile)),
      transformations: [
        (new Tone.Filter(400, 'lowpass')),
        (new Tone.EQ3(10, -1000, -1000)),
        (new Tone.PitchShift(12)),
        (new Tone.Freeverb()),
      ],
    },
  ],
  [
    {
      player: (new Tone.Player(soundfile)),
      transformations: [
        (new Tone.PitchShift(12)),
        (new Tone.Freeverb()),
      ],
    },
    {
      player: (new Tone.Player(soundfile)),
      transformations: [
        (new Tone.PitchShift(7)),
        (new Tone.Freeverb()),
      ],
    },
  ],
  [
    {
      // Duplicated to make accessing this player easier (can just access the same array)
      player: (new Tone.Player(soundfile)),
      transformations: [],
    },
    {
      // Original
      player: (new Tone.Player(soundfile)),
      transformations: [],
    },
  ],
];

const originalPlayer = (new Tone.Player(soundfile));

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

export const playPlayerBasedOnScoreAndStage = (score, stageNumber) => {
  const transformationIndex = stageNumber;
  console.log('transformationIndex ' + transformationIndex);
  console.log('score ' + score);
  const playerIndex = Math.round(score);
  console.log('playerIndex ' + playerIndex);
  playOnlyPlayerAtIndex(transformationIndex, playerIndex);
}
