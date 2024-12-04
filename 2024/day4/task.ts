import { parseInput } from '../src/parse-input';

type Coordinates = [number, number];

const WORD_TO_FIND = 'XMAS';

function parseIntoGrid(input: string[]): string[][] {
  return input.map((line) => line.split(''));
}

function countXmasWords([y, x]: Coordinates, grid: string[][]): number {
  const MAX_X = grid.length - 1;
  const MAX_Y = grid[0].length - 1;

  const hasXmasN = y >= 3 && `${grid[y][x]}${grid[y - 1][x]}${grid[y - 2][x]}${grid[y - 3][x]}` === WORD_TO_FIND;
  const hasXmasNW = y >= 3 && x >= 3 && `${grid[y][x]}${grid[y - 1][x - 1]}${grid[y - 2][x - 2]}${grid[y - 3][x - 3]}` === WORD_TO_FIND;
  const hasXmasNE = y >= 3 && x <= MAX_X - 3 && `${grid[y][x]}${grid[y - 1][x + 1]}${grid[y - 2][x + 2]}${grid[y - 3][x + 3]}` === WORD_TO_FIND;
  const hasXmasW = x >= 3 && `${grid[y][x]}${grid[y][x - 1]}${grid[y][x - 2]}${grid[y][x - 3]}` === WORD_TO_FIND;
  const hasXmasE = x <= MAX_X - 3 && `${grid[y][x]}${grid[y][x + 1]}${grid[y][x + 2]}${grid[y][x + 3]}` === WORD_TO_FIND;
  const hasXmasS = y <= MAX_Y - 3 && `${grid[y][x]}${grid[y + 1][x]}${grid[y + 2][x]}${grid[y + 3][x]}` === WORD_TO_FIND;
  const hasXmasSW = y <= MAX_Y - 3 && x >= 3 && `${grid[y][x]}${grid[y + 1][x - 1]}${grid[y + 2][x - 2]}${grid[y + 3][x - 3]}` === WORD_TO_FIND;
  const hasXmasSE = y <= MAX_Y - 3 && x <= MAX_X - 3 && `${grid[y][x]}${grid[y + 1][x + 1]}${grid[y + 2][x + 2]}${grid[y + 3][x + 3]}` === WORD_TO_FIND;

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
      console.log({ currentChar });
      if (currentChar !== 'X') {
        continue;
      }

      const count = countXmasWords([y, x], grid);
      total += count;
    }
  }

  return total;
}

function part2(input: string[]) {}

function go(): void {
  const input = parseInput('./input.txt');

  const res1 = part1(input);
  console.log('PART 1: ', res1);

  const res2 = part2(input);
  console.log('PART 2: ', res2);
}

go();
