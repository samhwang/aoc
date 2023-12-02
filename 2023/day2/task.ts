import { parseInput } from '../src/parse-input';

type GameSet = {
  red: number;
  green: number;
  blue: number;
};

type Color = 'red' | 'green' | 'blue';
type Cubes = `${number} ${Color} `

function isGameValid1(line: string, max: GameSet): boolean {
  const sets = line.substring(line.indexOf(': ') + 2).split(';');
  for (const set of sets) {
    let red = 0;
    let green = 0;
    let blue = 0;
    const grabs = set.split(',') as Cubes[];
    for (const grab of grabs) {
      const [count, color] = grab.trim().split(' ') as [number, Color];
      switch (color) {
        case 'red':
          red = count;
          break;

        case 'green':
          green = count;
          break;

        case 'blue':
          blue = count;
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

    const isValid = isGameValid1(line, { red: MAX_RED, green: MAX_GREEN, blue: MAX_BLUE });
    console.log({ line, isValid })
    if (isValid) {
      return sum + index + 1;
    }

    return sum;
  }, 0);

  return sum;
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
