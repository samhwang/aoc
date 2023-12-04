import { parseInput } from '../src/parse-input';

function calculateGameScore(card: string): number {
  // Format: Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
  const [winningNumbers, cardNumbers] = card
    .substring(card.indexOf(':') + 2)
    .split('|')
    .map((numbers) => {
      return numbers
        .trim()
        .split(' ')
        .filter((num) => num !== '')
        .map((num) => parseInt(num.trim(), 10));
    });

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

function part2(input: string[]) {}

function go() {
  const input = parseInput('./input.txt');

  const res1 = part1(input);
  console.log('PART 1: ', res1);

  const res2 = part2(input);
  console.log('PART 2: ', res2);
}

go();
