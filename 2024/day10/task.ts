import { parseInput } from '../src/parse-input';

type Y = number;
type X = number;
type Coordinates = [Y, X];
type Direction = 'N' | 'S' | 'E' | 'W';

const DIRECTION_MAP: Record<Direction, Coordinates> = {
  N: [-1, 0],
  W: [0, -1],
  E: [0, 1],
  S: [1, 0],
};

type MapMeta = {
  map: number[][],
  trailheads: Coordinates[]
}
function parseMap(input: string[]): MapMeta {
  const map: number[][] = []
  const trailheads: Coordinates[] = []

  for (let y = 0; y < input.length; y++) {
    const numRow = input[y].split('').map(num => Number.parseInt(num, 10))
    map.push(numRow)
    for (let x = 0; x < input[0].length; x++) {
      const spot = numRow[x]
      map[y].push(spot)
      if (spot !== 0) {
        continue;
      }

      trailheads.push([y, x])
    }
  }

  return {
    map,
    trailheads,
  }
}

function part1(input: string[]) {
  const {map, trailheads} = parseMap(input)
  console.log({ map, trailheads })
}

function part2(input: string[]) {}

function go(): void {
  console.time('task');

  console.time('parse-input');
  const input = parseInput('./sample.txt');
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
