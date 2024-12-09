import { parseInput } from '../src/parse-input';

type X = number;
type Y = number;
type Coordinates = [Y, X];

type Map = {
  maxX: X;
  maxY: Y;
  antennas: Record<string, Coordinates[]>;
};

function parseMap(input: string[]): Map {
  const maxX = input[0].length - 1;
  const maxY = input.length - 1;
  const antennas: Record<string, Coordinates[]> = {};
  for (let y = 0; y <= maxY; y++) {
    const line = input[y];
    const chars = line.split('');
    for (let x = 0; x <= maxX; x++) {
      const char = chars[x];
      if (char === '.') {
        continue;
      }

      if (!antennas[char]) {
        antennas[char] = [];
      }
      antennas[char].push([y, x]);
    }
  }

  return {
    maxX,
    maxY,
    antennas,
  };
}

function areCoordinatesEqual([y1, x1]: Coordinates, [y2, x2]: Coordinates): boolean {
  return y1 === y2 && x1 === x2;
}

function calculateCoordinatesDistance([y1, x1]: Coordinates, [y2, x2]: Coordinates): number {
  return Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
}

function addAntinodes(antinodes: Coordinates[], [y, x]: Coordinates, maxX: X, maxY: Y): Coordinates[] {
  const outBoundX = x < 0 || x > maxX;
  const outBoundY = y < 0 || y > maxY;

  if (outBoundX || outBoundY) {
    return antinodes;
  }

  const alreadyHasNode = antinodes.find((node) => areCoordinatesEqual([y, x], node));
  if (alreadyHasNode) {
    return antinodes;
  }

  antinodes.push([y, x]);
  return antinodes;
}

function part1(input: string[]) {
  const map = parseMap(input);
  const { maxX, maxY, antennas } = map;
  const antinodes: Coordinates[] = [];

  for (const antennasList of Object.values(antennas)) {
    while (antennasList.length > 0) {
      const startAntenna = antennasList[0];
      for (let i = 1; i < antennasList.length; i++) {
        const endAntenna = antennasList[i];
        const distance = calculateCoordinatesDistance(startAntenna, endAntenna);
        for (let y = 0; y <= maxY; y++) {
          for (let x = 0; x <= maxX; x++) {
            const node: Coordinates = [y, x];
            const distanceToStart = calculateCoordinatesDistance(node, startAntenna);
            const distanceToEnd = calculateCoordinatesDistance(node, endAntenna);

            const isValidAntinode =
              (distanceToStart === distance && distanceToEnd === 2 * distance) || (distanceToEnd === distance && distanceToStart === 2 * distance);
            if (isValidAntinode) {
              addAntinodes(antinodes, node, maxX, maxY);
            }
          }
        }
      }
      antennasList.shift();
    }
  }

  return antinodes.length;
}

function part2(mao: Map) {}

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
