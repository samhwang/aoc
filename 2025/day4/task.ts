import { parseInput } from '../src/parse-input';

const PAPER = '@';
const NOT_PAPER = '.';
const MAX_ADJACENT_PAPER = 4;

function buildMap(input: string[]): string[][] {
  return input.map((line) => line.split(''));
}

function countAdjacentRolls(map: string[][], x: number, y: number) {
  const nw = x > 0 && y > 0 ? map[y - 1][x - 1] : false;
  const n = y > 0 ? map[y - 1][x] : false;
  const ne = x < map[y].length - 1 && y > 0 ? map[y - 1][x + 1] : false;
  const w = x > 0 ? map[y][x - 1] : false;
  const e = x < map[y].length - 1 ? map[y][x + 1] : false;
  const sw = x > 0 && y < map.length - 1 ? map[y + 1][x - 1] : false;
  const s = y < map.length - 1 ? map[y + 1][x] : false;
  const se = x < map[y].length - 1 && y < map.length - 1 ? map[y + 1][x + 1] : false;

  const adjacentTiles = [nw, n, ne, w, e, sw, s, se];

  return adjacentTiles.filter((tile) => tile === PAPER).length;
}

function part1(input: string[]) {
  const map = buildMap(input);
  let acc = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] !== PAPER) {
        continue;
      }

      const count = countAdjacentRolls(map, x, y);
      if (count < MAX_ADJACENT_PAPER ) {
        acc++;
      }
    }
  }
  return acc;
}

function part2(input: string[]) {
  const map = buildMap(input);
  let acc = 0;
  let runAcc = 0;
  do {
    runAcc = 0;
    const toRemove: [number, number][] = [];
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] !== PAPER) {
          continue;
        }

        const count = countAdjacentRolls(map, x, y);
        if (count < MAX_ADJACENT_PAPER) {
          toRemove.push([y, x]);
          runAcc++;
        }
      }
    }

    acc += runAcc;
    toRemove.forEach(([y, x]) => {
      map[y][x] = NOT_PAPER;
    });
  } while (runAcc > 0);
  return acc;
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
