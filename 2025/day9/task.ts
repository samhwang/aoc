import { parseInput } from '../src/parse-input';

type Coordinates = {
  x: number;
  y: number;
};

function calculateRectangleSize(point1: Coordinates, point2: Coordinates): number {
  const width = Math.abs(point1.x - point2.x) + 1;
  const height = Math.abs(point1.y - point2.y) + 1;
  return width * height;
}

function buildRedTilesMap(input: string[]) {
  return input.map((line): Coordinates => {
    const [x, y] = line.split(',').map((num) => Number.parseInt(num, 10));
    return { x, y };
  });
}

function part1(input: string[]) {
  let largestArea = 0;
  const redTiles = buildRedTilesMap(input);
  for (let i = 0; i < redTiles.length; i++) {
    for (let j = i + 1; j < redTiles.length; j++) {
      const area = calculateRectangleSize(redTiles[i], redTiles[j]);
      largestArea = Math.max(largestArea, area);
    }
  }

  return largestArea;
}

function part2(input: string[]) {}

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
