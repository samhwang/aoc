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

function buildRedTilesMap(input: string[]): Coordinates[] {
  return input.map((line): Coordinates => {
    const [x, y] = line.split(',').map((num) => Number.parseInt(num, 10));
    return { x, y };
  });
}

/**
 * Boundary only contain the start and the tiles in between
 * because the last tile is included in the next boundary
 */
function buildBoundary(tile1: Coordinates, tile2: Coordinates): Coordinates[] {
  if (tile1.x === tile2.x) {
    const tiles: Coordinates[] = [tile1];
    const start = Math.min(tile1.y, tile2.y);
    const end = Math.max(tile1.y, tile2.y);
    for (let y = start + 1; y < end; y++) {
      tiles.push({ x: tile1.x, y });
    }
    return tiles;
  } else if (tile1.y === tile2.y) {
    const tiles: Coordinates[] = [tile1];
    const start = Math.min(tile1.x, tile2.x);
    const end = Math.max(tile1.x, tile2.x);
    for (let x = start + 1; x < end; x++) {
      tiles.push({ x, y: tile1.y });
    }
    return tiles;
  } else {
    throw new Error('INVALID INPUT.', {
      cause: `Points must be either horizontally or vertically aligned. Got ${tile1} and ${tile2}`,
    });
  }
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

function checkVertexWithinBounds(boundary: Coordinates[], tile: Coordinates) {
  // Check if vertex is on the boundary itself:
  if (boundary.some((vertex) => vertex.x === tile.x && vertex.y === tile.y)) {
    return true;
  }

  // Check if vertex is within the boundary area:
  const yLimit = boundary.filter(({ x }) => x === tile.x).map(({ y }) => y);
  const yMax = Math.max(...yLimit);
  const yMin = Math.min(...yLimit);
  const withinY = tile.y >= yMin && tile.y <= yMax;
  const xLimit = boundary.filter(({ y }) => y === tile.y).map(({ x }) => x);
  const xMax = Math.max(...xLimit);
  const xMin = Math.min(...xLimit);
  const withinX = tile.x >= xMin && tile.x <= xMax;

  return withinX && withinY;
}

function checkRectangleWithinBounds(boundary: Coordinates[], tile1: Coordinates, tile2: Coordinates) {
  // 2 of the vertices is already on the boundary anyway. So our check should be for the remaining 2 vertices.
  const vertex1 = { x: tile1.x, y: tile2.y };
  const vertex2 = { x: tile2.x, y: tile1.y };

  return checkVertexWithinBounds(boundary, vertex1) && checkVertexWithinBounds(boundary, vertex2);
}

function part2(input: string[]) {
  let largestArea = 0;
  const redTiles = buildRedTilesMap(input);
  const boundary = redTiles.reduce((acc, currentTile, index, thisArr) => {
    const nextIndex = index === thisArr.length - 1 ? 0 : index + 1;
    const greenTilesLine = buildBoundary(currentTile, thisArr[nextIndex]);
    return acc.concat(greenTilesLine);
  }, [] as Coordinates[]);

  // Procedure:
  // - For each pair of red tiles, find the 4 vertices of the rectangle
  // - Check if the 4 edges are in the boundary
  // - If not, skip calculation
  // - If yes, continue calculation and compare with `largestArea`
  for (let i = 0; i < redTiles.length; i++) {
    for (let j = i + 1; j < redTiles.length; j++) {
      const check = checkRectangleWithinBounds(boundary, redTiles[i], redTiles[j]);
      if (!check) {
        continue;
      }
      const area = calculateRectangleSize(redTiles[i], redTiles[j]);
      largestArea = Math.max(largestArea, area);
    }
  }
  return largestArea;
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
