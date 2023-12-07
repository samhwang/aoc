import { parseInput } from '../src/parse-input';

const CARDS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'] as const;
type Card = (typeof CARDS)[number];
type Hand = { cards: Card[]; bid: number };
function parseHands(input: string[]): Hand[] {
  return input
    .filter((line) => line !== '')
    .map((line) => {
      const [cards, bid] = line.split(' ');

      return {
        cards: cards.split('') as Card[],
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

function calculateHandScore(cards: Hand['cards']): (typeof HAND_SCORE)[keyof typeof HAND_SCORE] {
  const cardCounts = cards.reduce(
    (acc, card) => {
      acc[card] = acc[card] ? acc[card] + 1 : 1;
      return acc;
    },
    {} as Record<Card, number>
  );

  const fiveOfAKind = Object.entries(cardCounts).some(([_, count]) => count === 5);
  if (fiveOfAKind) {
    return HAND_SCORE.FIVE_OF_A_KIND;
  }

  const fourOfAKind = Object.entries(cardCounts).some(([_, count]) => count === 4);
  if (fourOfAKind) {
    return HAND_SCORE.FOUR_OF_A_KIND;
  }

  const threeOfAKind = Object.entries(cardCounts).some(([_, count]) => count === 3);

  const pairs = Object.entries(cardCounts).filter(([_, count]) => count === 2);
  const hasOnePair = pairs.length === 1;

  if (hasOnePair && threeOfAKind) {
    return HAND_SCORE.FULL_HOUSE;
  }

  if (threeOfAKind) {
    return HAND_SCORE.THREE_OF_A_KIND;
  }

  if (hasOnePair) {
    return HAND_SCORE.ONE_PAIR;
  }

  const hasTwoPairs = pairs.length === 2;
  if (hasTwoPairs) {
    return HAND_SCORE.TWO_PAIRS;
  }

  return HAND_SCORE.HIGH_CARD;
}

function part1(input: string[]) {
  const hands = parseHands(input);

  const scores = hands
    .map((hand) => {
      const score = calculateHandScore(hand.cards);
      return { ...hand, score };
    })
    .sort((a, b) => {
      if (a.score !== b.score) {
        return a.score - b.score;
      }

      let compare = 0;
      for (let i = 0; i < 5; i++) {
        if (a.cards[i] === b.cards[i]) {
          continue;
        }

        compare = CARDS.indexOf(b.cards[i]) - CARDS.indexOf(a.cards[i]);
      }
      return compare;
    });
  console.log(scores);

  const totalWin = scores.reduce((acc, hand, index) => {
    const result = acc + hand.bid * (index + 1);

    return result;
  }, 0);
  return totalWin;
}

function part2(input: string[]) {}

function go() {
  const input = parseInput('./input.txt');

  const res1 = part1(input);
  console.log('PART 1: ', res1);

  const res2 = part2(input);
  console.log('PART 2: ', res2);
}

go();
