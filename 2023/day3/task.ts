import { parseInput } from '../src/parse-input';

const DOT = '.';

function isNumber(text: string): boolean {
  return !Number.isNaN(Number.parseInt(text, 10));
}

function isNotDot(text: string): boolean {
  return text !== DOT;
}

function isValidSymbol(text: string): boolean {
  return !!text && !isNumber(text) && isNotDot(text);
}

function isAdjacentToSymbol(map: string[], row: number, col: number): boolean {
  const MAX_COL = map[0].length - 1;
  const MAX_ROW = map.length - 1;
  let valid = false;

  for (let r = row - 1; r <= row + 1; r++) {
    if (r < 0 || r > MAX_ROW) {
      continue;
    }

    for (let c = col - 1; c <= col + 1; c++) {
      if (c < 0 || c > MAX_COL) {
        continue;
      }
      valid = valid || isValidSymbol(map[r][c]);
    }
  }

  return valid;
}

function part1(map: string[]): number {
  let sum = 0;
  let numberString = '';
  let adjacentToSymbol = false;

  for (let row = 0; row < map.length; row++) {
    const line = map[row];

    if (line === '') {
      break;
    }

    for (let col = 0; col < line.length; col++) {
      const char = line[col];
      if (!isNumber(char)) {
        if (numberString !== '' && adjacentToSymbol) {
          sum += Number.parseInt(numberString, 10);
        }
        numberString = '';
        adjacentToSymbol = false;
        continue;
      }

      if (isNumber(char)) {
        numberString += char;
        adjacentToSymbol = adjacentToSymbol || isAdjacentToSymbol(map, row, col);
      }

      if (col === line.length - 1) {
        if (numberString !== '' && adjacentToSymbol) {
          sum += Number.parseInt(numberString, 10);
        }
        numberString = '';
        adjacentToSymbol = false;
      }
    }
  }

  return sum;
}

const GEAR = '*';

function calculateGearRatio(map: string[], row: number, col: number): number {
  const MAX_COL = map[0].length - 1;
  const MAX_ROW = map.length - 1;
  let ratio = 1;
  const coordinates: [number, number][] = [];

  for (let r = row - 1; r <= row + 1; r++) {
    if (r < 0 || r > MAX_ROW) {
      continue;
    }

    for (let c = col - 1; c <= col + 1; c++) {
      if (c < 0 || c > MAX_COL) {
        continue;
      }
      if (isNumber(map[r][c])) {
        coordinates.push([r, c])
      }
    }
  }

  console.log({ coordinates });
}

function part2(map: string[]): number {
  let sum = 0;

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      const char = map[row][col];
      if (char !== GEAR) {
        continue;
      }

      calculateGearRatio(map, row, col);
    }
  }

  return sum;
}

function go() {
  const input = parseInput('./sample.txt');

  const res1 = part1(input);
  console.log('PART 1: ', res1);

  const res2 = part2(input);
  console.log('PART 2: ', res2);
}

go();
