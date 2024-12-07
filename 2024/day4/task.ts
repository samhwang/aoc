import { parseInput } from '../src/parse-input';

type Coordinates = [number, number];
type Direction = 'N' | 'S' | 'E' | 'W' | 'NW' | 'NE' | 'SE' | 'SW';

const DIRECTION_MAP: Record<Direction, Coordinates> = {
  N: [-1, 0],
  NW: [-1, -1],
  NE: [-1, +1],
  W: [0, -1],
  E: [0, 1],
  S: [1, 0],
  SW: [1, -1],
  SE: [1, 1],
};

function iterateCoordinates([y, x]: Coordinates, direction: Direction, times: number): Coordinates {
  const [plusY, plusX] = DIRECTION_MAP[direction];
  return [y + plusY * times, x + plusX * times];
}

function formWordOnGrid([y, x]: Coordinates, direction: Direction, wordLength: number, grid: string[][]): string {
  try {
    let word = grid[y][x];

    for (let i = 1; i <= wordLength; i++) {
      const [newY, newX] = iterateCoordinates([y, x], direction, i);
      word = `${word}${grid[newY][newX]}`;
    }

    return word;
  } catch (error) {
    console.log('ERROR: Out of boundary', {
      coordinates: [y, x],
      direction,
      wordLength,
    });
    return '';
  }
}

function parseIntoGrid(input: string[]): string[][] {
  return input.map((line) => line.split(''));
}

/** p1: Count all the XMAS words that occured in the word grid */
function countXmasWords([y, x]: Coordinates, grid: string[][]): number {
  const WORD_TO_FIND = 'XMAS';
  const LENGTH = WORD_TO_FIND.length - 1;
  const MAX_X = grid.length - 1;
  const MAX_Y = grid[0].length - 1;

  const hasXmasN = y >= LENGTH && formWordOnGrid([y, x], 'N', LENGTH, grid) === WORD_TO_FIND;
  const hasXmasNW = y >= LENGTH && x >= LENGTH && formWordOnGrid([y, x], 'NW', LENGTH, grid) === WORD_TO_FIND;
  const hasXmasNE = y >= LENGTH && x <= MAX_X - LENGTH && formWordOnGrid([y, x], 'NE', LENGTH, grid) === WORD_TO_FIND;
  const hasXmasW = x >= 3 && formWordOnGrid([y, x], 'W', LENGTH, grid) === WORD_TO_FIND;
  const hasXmasE = x <= MAX_X - LENGTH && formWordOnGrid([y, x], 'E', LENGTH, grid) === WORD_TO_FIND;
  const hasXmasS = y <= MAX_Y - LENGTH && formWordOnGrid([y, x], 'S', LENGTH, grid) === WORD_TO_FIND;
  const hasXmasSW = y <= MAX_Y - LENGTH && x >= LENGTH && formWordOnGrid([y, x], 'SW', LENGTH, grid) === WORD_TO_FIND;
  const hasXmasSE = y <= MAX_Y - LENGTH && x <= MAX_X - LENGTH && formWordOnGrid([y, x], 'SE', LENGTH, grid) === WORD_TO_FIND;

  const checks = [hasXmasN, hasXmasNW, hasXmasNE, hasXmasW, hasXmasE, hasXmasS, hasXmasSW, hasXmasSE];
  const count = checks.reduce((count, check) => (check ? count + 1 : count), 0);

  return count;
}

function part1(input: string[]): number {
  let total = 0;
  const grid = parseIntoGrid(input);
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const currentChar = grid[y][x];
      if (currentChar !== 'X') {
        continue;
      }

      const count = countXmasWords([y, x], grid);
      total += count;
    }
  }

  return total;
}

/** p2: Count all the MAS words that form an X in the grid */
function countMasWords([y, x]: Coordinates, grid: string[][]): number {
  const WORD_TO_FIND = 'MAS';
  const REVERSED_WORD_TO_FIND = 'SAM';
  const LENGTH = WORD_TO_FIND.length - 1;
  const MAX_X = grid.length - 1;
  const MAX_Y = grid[0].length - 1;

  const hasMasNW =
    y >= LENGTH &&
    x >= LENGTH &&
    formWordOnGrid([y, x], 'NW', LENGTH, grid) === WORD_TO_FIND &&
    [WORD_TO_FIND, REVERSED_WORD_TO_FIND].includes(formWordOnGrid([y - LENGTH, x], 'SW', LENGTH, grid));
  const hasMasNE =
    y >= LENGTH &&
    x <= MAX_X - LENGTH &&
    formWordOnGrid([y, x], 'NE', LENGTH, grid) === WORD_TO_FIND &&
    [WORD_TO_FIND, REVERSED_WORD_TO_FIND].includes(formWordOnGrid([y - LENGTH, x], 'SE', LENGTH, grid));
  const hasMasSW =
    y <= MAX_Y - LENGTH &&
    x >= LENGTH &&
    formWordOnGrid([y, x], 'SW', LENGTH, grid) === WORD_TO_FIND &&
    [WORD_TO_FIND, REVERSED_WORD_TO_FIND].includes(formWordOnGrid([y + LENGTH, x], 'NW', LENGTH, grid));
  const hasMasSE =
    y <= MAX_Y - LENGTH &&
    x <= MAX_X - LENGTH &&
    formWordOnGrid([y, x], 'SE', LENGTH, grid) === WORD_TO_FIND &&
    [WORD_TO_FIND, REVERSED_WORD_TO_FIND].includes(formWordOnGrid([y + LENGTH, x], 'NE', LENGTH, grid));

  const checks = [hasMasNW, hasMasNE, hasMasSW, hasMasSE];
  const count = checks.reduce((count, check) => (check ? count + 1 : count), 0);

  // Because we're basically searching for 2 instances of the `MAS` string, there will be duplicates.
  // So divide this result by 2 will give us the final result.
  return count / 2;
}

function part2(input: string[]) {
  let total = 0;
  const grid = parseIntoGrid(input);
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const currentChar = grid[y][x];
      if (currentChar !== 'M') {
        continue;
      }

      const count = countMasWords([y, x], grid);
      total += count;
    }
  }

  return total;
}

function go(): void {
  console.time('task');

  console.time('parse-input');
  const input = parseInput('./input.txt');
  console.timeEnd('parse-input');

  console.time('part 1');
  const res1 = part1(input);
  console.log('PART 1: ', res1);
  console.timeEnd('part 1');

  console.time('part 2');
  const res2 = part2(input);
  console.log('PART 2: ', res2);
  console.timeEnd('part 2');

  console.timeEnd('task');
}

go();
