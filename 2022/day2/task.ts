const plays = Deno.readTextFileSync('./input.txt').split('\n');
const WIN_SCORE = 6;
const DRAW_SCORE = 3;

type OpponentHand = 'A' | 'B' | 'C';

// Task 1: Assuming X Y Z = Rock Paper Scissors
type MyHand = 'X' | 'Y' | 'Z';

interface Shape {
  score: 1 | 2 | 3;
  winAgainst: OpponentHand;
  equal: OpponentHand;
}

const shapeMap: Record<MyHand, Shape> = {
  X: {
    score: 1,
    winAgainst: 'C',
    equal: 'A',
  },
  Y: {
    score: 2,
    winAgainst: 'A',
    equal: 'B',
  },
  Z: {
    score: 3,
    winAgainst: 'B',
    equal: 'C',
  },
};

function getScore(opponent: OpponentHand, my: MyHand) {
  const { score, winAgainst, equal } = shapeMap[my];
  switch (opponent) {
    case winAgainst:
      return score + WIN_SCORE;
    case equal:
      return score + DRAW_SCORE;
    default:
      return score;
  }
}

const total1 = plays.map((line) => line.split(' ') as [OpponentHand, MyHand]).reduce<number>(
  (accumulator, [opponent, choice]) => accumulator + getScore(opponent, choice),
  0,
);
console.log({ total1 });

// Task 2: Assuming X Y Z = Lose Draw Win
type Outcome = 'X' | 'Y' | 'Z';

interface Shape2 extends Shape {
  loseAgainst: OpponentHand;
}

const shapeMap2: Record<OpponentHand, Shape2> = {
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

function getScore2(opponent: OpponentHand, outcome: Outcome) {
  const opponentPlay = shapeMap2[opponent];
  switch (outcome) {
    case 'X':
      return shapeMap2[opponentPlay.winAgainst].score;
    case 'Y':
      return shapeMap2[opponentPlay.equal].score + DRAW_SCORE;
    case 'Z':
      return shapeMap2[opponentPlay.loseAgainst].score + WIN_SCORE;
  }
}

const total2 = plays.map((line) => line.split(' ') as [OpponentHand, Outcome]).reduce<number>(
  (accumulator, [opponent, outcome]) => accumulator + getScore2(opponent, outcome),
  0,
);
console.log({ total2 });
