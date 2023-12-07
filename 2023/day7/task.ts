import { parseInput } from '../src/parse-input';

const CARDS1 = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'] as const;
const CARDS2 = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'] as const;
type Card = (typeof CARDS1 | typeof CARDS2)[number];
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

// Cards are now aligned with CARDS1, with no wild card
function calculateHandScore1(cards: Hand['cards']): (typeof HAND_SCORE)[keyof typeof HAND_SCORE] {
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
      const score = calculateHandScore1(hand.cards);
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

        const cardA = a.cards[i];
        const indexA = CARDS1.indexOf(cardA);
        const cardB = b.cards[i];
        const indexB = CARDS1.indexOf(cardB);
        compare = indexA - indexB;
        break;
      }
      return compare;
    });
  scores.forEach((score) => {
    console.log(score);
  });

  const totalWin = scores.reduce((acc, hand, index) => {
    const result = acc + hand.bid * (index + 1);

    return result;
  }, 0);
  return totalWin;
}

// Cards are now aligned with CARDS2, with J as a wild card
function calculateHandScore2(cards: Hand['cards']): (typeof HAND_SCORE)[keyof typeof HAND_SCORE] {
  const cardCounts = cards.reduce(
    (acc, card) => {
      acc[card] = acc[card] ? acc[card] + 1 : 1;
      return acc;
    },
    { J: 0 } as Record<Card, number>
  );

  const countJ = cardCounts.J;
  if (countJ === 5 || countJ === 4) {
    // If we have 5Js, it's already a 5 of a kind.
    // If we have 4Js, it can be paired with another card to become 5 of a kind.
    return HAND_SCORE.FIVE_OF_A_KIND;
  }

  if (countJ === 3) {
    // If we have 3Js,...
    const scoreWithoutJs = calculateHandScore1(cards.filter((card) => card !== 'J'));
    if (scoreWithoutJs === HAND_SCORE.HIGH_CARD) {
      // We can pair with a high card to make 4 of a kind
      return HAND_SCORE.FOUR_OF_A_KIND;
    }

    if (scoreWithoutJs === HAND_SCORE.ONE_PAIR) {
      // Or a pair to make 5 of a kind
      return HAND_SCORE.FIVE_OF_A_KIND;
    }

    throw new Error('Unexpected score');
  }

  if (countJ === 2) {
    // If we have 2Js,...
    const scoreWithoutJs = calculateHandScore1(cards.filter((card) => card !== 'J'));
    if (scoreWithoutJs === HAND_SCORE.HIGH_CARD) {
      // We can pair with a high card to make 3 of a kind
      return HAND_SCORE.THREE_OF_A_KIND;
    }

    if (scoreWithoutJs === HAND_SCORE.ONE_PAIR) {
      // Or a pair to make 4 of a kind
      return HAND_SCORE.FOUR_OF_A_KIND;
    }

    if (scoreWithoutJs === HAND_SCORE.THREE_OF_A_KIND) {
      // Or a 3 of a kind to make 5 of a kind
      return HAND_SCORE.FIVE_OF_A_KIND;
    }

    throw new Error('Unexpected score');
  }

  if (countJ === 1) {
    // If we have 1J,...
    const scoreWithoutJs = calculateHandScore1(cards.filter((card) => card !== 'J'));
    if (scoreWithoutJs === HAND_SCORE.HIGH_CARD) {
      // We can pair with a high card to make 2 pairs
      return HAND_SCORE.TWO_PAIRS;
    }

    if (scoreWithoutJs === HAND_SCORE.ONE_PAIR) {
      // Or a pair to make 3 of a kind
      return HAND_SCORE.THREE_OF_A_KIND;
    }

    if (scoreWithoutJs === HAND_SCORE.TWO_PAIRS) {
      // Or a 2 pairs to make full house
      return HAND_SCORE.FULL_HOUSE;
    }

    if (scoreWithoutJs === HAND_SCORE.THREE_OF_A_KIND) {
      // Or a 3 of a kind to make 4 of a kind
      return HAND_SCORE.FOUR_OF_A_KIND;
    }

    if (scoreWithoutJs === HAND_SCORE.FOUR_OF_A_KIND) {
      // Or a 4 of a kind to make 5 of a kind
      return HAND_SCORE.FIVE_OF_A_KIND;
    }

    throw new Error('Unexpected score');
  }

  // we have no Js here.
  return calculateHandScore1(cards);
}

function part2(input: string[]) {
  const hands = parseHands(input);

  const scores = hands
    .map((hand) => {
      const score = calculateHandScore2(hand.cards);
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

        const cardA = a.cards[i];
        const indexA = CARDS2.indexOf(cardA);
        const cardB = b.cards[i];
        const indexB = CARDS2.indexOf(cardB);
        compare = indexA - indexB;
        break;
      }
      return compare;
    });
  scores.forEach((score) => {
    console.log(score);
  });

  const totalWin = scores.reduce((acc, hand, index) => {
    const result = acc + hand.bid * (index + 1);

    return result;
  }, 0);
  return totalWin;
}

function go() {
  const input = parseInput('./input.txt');

  const res1 = part1(input);
  console.log('PART 1: ', res1);

  const res2 = part2(input);
  console.log('PART 2: ', res2);
}

go();
