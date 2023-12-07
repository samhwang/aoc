import { parseInput } from '../src/parse-input';

type Hand = { cards: string[]; bid: number };
function parseHands(input: string[]): Hand[] {
  return input
    .filter((line) => line !== '')
    .map((line) => {
      const [cards, bid] = line.split(' ');

      return {
        cards: cards.split('').sort(),
        bid: Number.parseInt(bid, 10),
      };
    });
}

const HAND_SCORE = {
  FIVE_OF_A_KIND: 6,
  FOUR_OF_A_KIND: 5,
  FULL_HOUSE: 4,
  THREE_OF_A_KIND: 3,
  TWO_PAIRS: 2,
  ONE_PAIR: 1,
  HIGH_CARD: 0,
} as const;

function part1(input: string[]) {
  const hands = parseHands(input);
  console.log(hands);
}

function part2(input: string[]) {}

function go() {
  const input = parseInput('./sample.txt');

  const res1 = part1(input);
  console.log('PART 1: ', res1);

  const res2 = part2(input);
  console.log('PART 2: ', res2);
}

go();
