import { parseInput } from '../src/parse-input';

type GameSet = {
  red: number;
  green: number;
  blue: number;
};

type Color = 'red' | 'green' | 'blue';
type Cubes = `${number} ${Color} `

function isGameValid1(line: string): boolean {
  let isValid = true;

  const sets = line.substring(line.indexOf(': ') + 1).split(';');
  for (const set of sets) {
    let red = 0;
    let green = 0;
    let blue = 0;
    const grabs: Cubes[] = set.split(',');
  }

  return isValid;
}

function part1(input: string[]): number {
  const MAX_RED = 12;
  const MAX_GREEN = 13;
  const MAX_BLUE = 14;

  return 0;
}

function part2(input: string[]): number {
  return 0;
}

function go() {
  const input = parseInput('./input.txt');

  const res1 = part1(input);
  console.log('PART 1: ', res1);

  const res2 = part2(input);
  console.log('PART 2: ', res2);
}

go();
