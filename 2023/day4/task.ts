import { parseInput } from '../src/parse-input';

function splitCardFormat(card: string): readonly [number[], number[]] {
  // Format: Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
  const [winningNumbers, cardNumbers] = card
    .substring(card.indexOf(':') + 2)
    .split('|')
    .map((numbers) => {
      return numbers
        .trim()
        .split(' ')
        .reduce(
          (acc, num) => {
            if (!num) {
              return acc;
            }

            acc.push(Number.parseInt(num.trim(), 10));
            return acc;
          },
          [] as number[]
        );
    });

  return [winningNumbers, cardNumbers] as const;
}

function calculateGameScore(card: string): number {
  const [winningNumbers, cardNumbers] = splitCardFormat(card);

  let score = 0;
  for (const num of cardNumbers) {
    if (!winningNumbers.includes(num)) {
      continue;
    }

    if (!score) {
      score = 1;
      continue;
    }
    score = !score ? 1 : score * 2;
  }

  return score;
}

function part1(input: string[]): number {
  let totalScore = 0;
  for (const card of input) {
    if (card === '') continue;
    totalScore += calculateGameScore(card);
  }

  return totalScore;
}

type CardMap = Record<number, number>;

function calculateScratchCard(card: string): number {
  const [winningNumbers, cardNumbers] = splitCardFormat(card);

  const cards = cardNumbers.reduce((acc, num) => {
    if (!winningNumbers.includes(num)) {
      return acc;
    }

    return acc + 1;
  }, 0);

  return cards;
}

function part2(input: string[]): number {
  const cardMap = input.reduce((acc, card, index) => {
    if (card === '') return acc;

    const wonCards = calculateScratchCard(card);
    const gameId = index + 1;

    // If game hasn't been won or played, then we only have 1 card as the default
    if (!acc[gameId]) {
      acc[gameId] = 1;
    } else {
      // If a card has been won for said game, add 1 to the total
      acc[gameId] += 1;
    }

    for (let i = 1; i <= wonCards; i++) {
      if (!acc[gameId + i]) {
        // Similar logic applies here. If the game hasn't been played
        // then we only have default number of cards as the number of cards in the current game
        acc[gameId + i] = acc[gameId];
      } else {
        // And if we have some played, add that number into the total
        acc[gameId + i] += acc[gameId];
      }
    }

    return acc;
  }, {} as CardMap);

  // Sum up all the cards
  const totalCards = Object.values(cardMap).reduce((acc, num) => acc + num, 0);
  return totalCards;
}

function part22(input: string[]): number {
  const totalCards = input.reduce(
    (acc, card) => {
      if (card === '') return acc;

      const wonCards = calculateScratchCard(card);

      // If no cards won, then we only have 1 card as the default
      if (!wonCards) {
        return acc + 1;
      }

      // If we win some cards, add those to the total.
      return acc + wonCards;
    },
    0
  );

  return totalCards;
}

function go() {
  const input = parseInput('./input.txt');

  const res1 = part1(input);
  console.log('PART 1: ', res1);

  const res2 = part2(input);
  console.log('PART 2: ', res2);

  const res22 = part22(input);
  console.log('PART 22: ', res22);
}

go();
