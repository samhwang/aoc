import { parseInput } from '../src/parse-input';

type X = number;
type Y = number;
type Coordinates = [Y, X];

type Antenna = {
  frequency: string;
  coordinates: Coordinates;
};

type Map = {
  maxX: X;
  maxY: Y;
  antennas: Antenna[];
};

function parseMap(input: string[]): Map {
  const maxX = input[0].length - 1;
  const maxY = input.length - 1;
  const antennas = input.reduce<Antenna[]>((accum, line, rowIndex) => {
    const antennasInLine = line.split('').reduce<Antenna[]>((lineAccum, char, colIndex) => {
      if (char === '.') {
        return lineAccum;
      }

      const antenna: Antenna = {
        frequency: char,
        coordinates: [rowIndex, colIndex],
      };
      lineAccum.push(antenna);
      return lineAccum;
    }, []);

    return accum.concat(antennasInLine);
  }, []);

  return {
    maxX,
    maxY,
    antennas,
  };
}

function areCoordinatesEqual([y1, x1]: Coordinates, [y2, x2]: Coordinates): boolean {
  return y1 === y2 && x1 === x2;
}

function calculateCoordinatesDistance([y1, x1]: Coordinates, [y2, x2]: Coordinates): [number, number] {
  return [Math.abs(y2 - y1), Math.abs(x2 - x1)];
}

function part1(map: Map) {}

function part2(mao: Map) {}

function go(): void {
  console.time('task');

  console.time('parse-input');
  const input = parseInput('./input.txt');
  const map = parseMap(input);
  console.timeEnd('parse-input');

  console.time('part 1');
  const res1 = part1(map);
  console.log('PART 1: ', res1);
  console.timeEnd('part 1');

  console.time('part 2');
  const res2 = part2(map);
  console.log('PART 2: ', res2);
  console.timeEnd('part 2');

  console.timeEnd('task');
}

go();
