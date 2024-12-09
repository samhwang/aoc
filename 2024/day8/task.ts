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

function getNextNodeInlineSameDistance(node1: Coordinates, node2: Coordinates, step: number): Coordinates {
  return [(step + 1) * node1[0] - step * node2[0], (step + 1) * node1[1] - step * node2[1]];
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
        const node1: Coordinates = getNextNodeInlineSameDistance(startAntenna, endAntenna, 1);
        addAntinodes(antinodes, node1, maxX, maxY);
        const node2: Coordinates = getNextNodeInlineSameDistance(endAntenna, startAntenna, 1);
        addAntinodes(antinodes, node2, maxX, maxY);
      }
      antennasList.shift();
    }
  }

  return antinodes.length;
}

function areNodesInline(node1: Coordinates, node2: Coordinates, node3: Coordinates): boolean {
  return (node1[0] - node2[0]) * (node3[1] - node2[1]) === (node1[1] - node2[1]) * (node3[0] - node2[0]);
}

function part2(input: string[]) {
  const map = parseMap(input);
  const { maxX, maxY, antennas } = map;
  const antinodes: Coordinates[] = Object.values(antennas).flat();

  for (const antennasList of Object.values(antennas)) {
    while (antennasList.length > 0) {
      const startAntenna = antennasList[0];
      for (let i = 1; i < antennasList.length; i++) {
        const endAntenna = antennasList[i];
        for (let y = 0; y <= maxY; y++) {
          for (let x = 0; x <= maxX; x++) {
            const node: Coordinates = [y, x];
            const isInline = areNodesInline(startAntenna, endAntenna, node);
            if (isInline) {
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
