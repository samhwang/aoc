import { parseInput } from '../src/parse-input';

function charIsNumber(char: string): boolean {
  return !Number.isNaN(Number.parseInt(char, 10));
}

function getNumberFromLine1(line: string): number {
  let first = '';
  let last = '';

  for (let index = 0; index < line.length; index++) {
    if (charIsNumber(line[index])) {
      const digit = line[index];
      if (!first) {
        first = digit;
      }

      last = digit;
    }
  }

  return Number.parseInt(`${first}${last}`, 10);
}

function part1(input: string[]): number {
  return input.reduce((acc, line) => {
    if (line.length === 0) {
      return acc;
    }
    return acc + getNumberFromLine1(line);
  }, 0);
}

const DIGIT_TO_NUMBER = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
} as const;

function findStartingDigit(line: string): string {
  let digit = '';

  for (const key of Object.keys(DIGIT_TO_NUMBER)) {
    if (line.startsWith(key)) {
      digit = DIGIT_TO_NUMBER[key];
      break;
    }
  }

  return digit;
}

function getNumberFromLine2(line: string): number {
  let first = '';
  let last = '';

  for (let index = 0; index < line.length; index++) {
    if (charIsNumber(line[index])) {
      const digit = line[index];
      if (!first) {
        first = digit;
      }

      last = digit;
      continue;
    }

    const digit = findStartingDigit(line.substring(index));
    if (digit) {
      if (!first) {
        first = digit;
      }

      last = digit;
    }
  }

  return Number.parseInt(`${first}${last}`, 10);
}

function part2(input: string[]): number {
  return input.reduce((acc, line) => {
    if (line.length === 0) {
      return acc;
    }
    return acc + getNumberFromLine2(line);
  }, 0);
}

function go() {
  const input = parseInput('./input.txt');

  const res1 = part1(input);
  console.log('PART 1: ', res1);

  const res2 = part2(input);
  console.log('PART 2: ', res2);
}

go();
