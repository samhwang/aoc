// Task 2: Assuming X Y Z = Lose Draw Win

type Hand = 'A' | 'B' | 'C';

interface Shape {
  score: number;
  winAgainst: Hand;
  equal: Hand;
  loseAgainst: Hand;
}

const shapeMap: Record<Hand, Shape> = {
  A: {
    score: 1,
    winAgainst: 'C',
    equal: 'A',
    loseAgainst: 'B',
  },
  B: {
    score: 2,
    winAgainst: 'A',
    equal: 'B',
    loseAgainst: 'C',
  },
  C: {
    score: 3,
    winAgainst: 'B',
    equal: 'C',
    loseAgainst: 'A',
  },
};

type Outcome = 'X' | 'Y' | 'Z';

const WIN_SCORE = 6;
const DRAW_SCORE = 3;

const plays = Deno.readTextFileSync('./input.txt').split('\n').map((line) => line.split(' ') as [Hand, Outcome]);

const total = plays.reduce<number>((accumulator, [opponent, outcome]) => {
  const opponentPlay = shapeMap[opponent];
  let myPlay: Hand;
  switch (outcome) {
    case 'X':
      myPlay = opponentPlay.winAgainst;
      return accumulator + shapeMap[myPlay].score;

    case 'Y':
      myPlay = opponentPlay.equal;
      return accumulator + DRAW_SCORE + shapeMap[myPlay].score;

    case 'Z':
      myPlay = opponentPlay.loseAgainst;
      return accumulator + WIN_SCORE + shapeMap[myPlay].score;
  }
}, 0);
console.log({ total });
