import { parseInput } from '../src/parse-input';

type GameSet = {
  red: number;
  green: number;
  blue: number;
};

type Color = 'red' | 'green' | 'blue';
type Cubes = `${number} ${Color} `;

function isGameValid(line: string, max: GameSet): boolean {
  const sets = line.substring(line.indexOf(': ') + 2).split(';');
  for (const set of sets) {
    let red = 0;
    let green = 0;
    let blue = 0;
    const grabs = set.split(',') as Cubes[];
    for (const grab of grabs) {
      const [count, color] = grab.trim().split(' ') as [string, Color];
      switch (color) {
        case 'red':
          red = Number.parseInt(count, 10);
          break;

        case 'green':
          green = Number.parseInt(count, 10);
          break;

        case 'blue':
          blue = Number.parseInt(count, 10);
      }
    }

    if (red > max.red || green > max.green || blue > max.blue) {
      return false;
    }
  }

  return true;
}

function part1(input: string[]): number {
  const MAX_RED = 12;
  const MAX_GREEN = 13;
  const MAX_BLUE = 14;

  const sum = input.reduce((sum, line, index) => {
    if (line === '') {
      return sum;
    }

    const isValid = isGameValid(line, { red: MAX_RED, green: MAX_GREEN, blue: MAX_BLUE });
    if (isValid) {
      return sum + index + 1;
    }

    return sum;
  }, 0);

  return sum;
}

function getBiggestNumber(a: number, b: number) {
  return a > b ? a : b;
}

function calculateCubePower(line: string): number {
  let MIN_RED = 0;
  let MIN_GREEN = 0;
  let MIN_BLUE = 0;

  const sets = line.substring(line.indexOf(': ') + 2).split(';');
  for (const set of sets) {
    const grabs = set.split(',') as Cubes[];
    for (const grab of grabs) {
      const [count, color] = grab.trim().split(' ') as [string, Color];
      switch (color) {
        case 'red':
          MIN_RED = getBiggestNumber(MIN_RED, Number.parseInt(count, 10));
          break;

        case 'green':
          MIN_GREEN = getBiggestNumber(MIN_GREEN, Number.parseInt(count, 10));
          break;

        case 'blue':
          MIN_BLUE = getBiggestNumber(MIN_BLUE, Number.parseInt(count, 10));
      }
    }
  }

  return MIN_RED * MIN_GREEN * MIN_BLUE;
}

function part2(input: string[]): number {
  const sum = input.reduce((sum, line) => {
    if (line === '') {
      return sum;
    }

    const power = calculateCubePower(line);

    return sum + power;
  }, 0);

  return sum;
}

function go() {
  const input = parseInput('./input.txt');

  const res1 = part1(input);
  console.log('PART 1: ', res1);

  const res2 = part2(input);
  console.log('PART 2: ', res2);
}

go();
