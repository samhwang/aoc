// Task 1: Assuming X Y Z = Rock Paper Scissors

type Opponent = 'A' | 'B' | 'C';
type Choice = 'X' | 'Y' | 'Z';

interface Shape {
  score: 1 | 2 | 3;
  winAgainst: Opponent;
  equivalent: Opponent;
}

const shapeMap: Record<Choice, Shape> = {
  X: {
    score: 1,
    winAgainst: 'C',
    equivalent: 'A',
  },
  Y: {
    score: 2,
    winAgainst: 'A',
    equivalent: 'B',
  },
  Z: {
    score: 3,
    winAgainst: 'B',
    equivalent: 'C',
  },
};

const WIN_SCORE = 6;
const DRAW_SCORE = 3;

const plays = Deno.readTextFileSync('./input.txt').split('\n').map((line) => line.split(' ') as [Opponent, Choice]);

const total = plays.reduce<number>((accumulator, [opponent, choice]) => {
  const shapeScore = shapeMap[choice].score;
  switch (opponent) {
    case shapeMap[choice].winAgainst:
      return accumulator + shapeScore + WIN_SCORE;

    case shapeMap[choice].equivalent:
      return accumulator + shapeScore + DRAW_SCORE;

    default:
      return accumulator + shapeScore;
  }
}, 0);
console.log({ total });
