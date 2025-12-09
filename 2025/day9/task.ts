import { parseInput } from '../src/parse-input';

type Coordinates = {
  x: number;
  y: number;
};

function buildRedTilesMap(input: string[]): Coordinates[] {
  return input.map((line): Coordinates => {
    const [x, y] = line.split(',').map((num) => Number.parseInt(num, 10));
    return { x, y };
  });
}

function calculateRectangleSize(point1: Coordinates, point2: Coordinates): number {
  const width = Math.abs(point1.x - point2.x) + 1;
  const height = Math.abs(point1.y - point2.y) + 1;
  return width * height;
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

/**
 * Check using the Ray casting method of dealing with Polygon edges.
 * @see https://en.wikipedia.org/wiki/Point_in_polygon
 */
function isPointWithinBoundary(boundary: Coordinates[], point: Coordinates): boolean {
  let inside = false;
  const n = boundary.length;

  for (let i = 0; i < n; i++) {
    const current = boundary[i];
    const next = boundary[(i + 1) % n];

    const isVerticalEdge = current.x === next.x;
    if (isVerticalEdge) {
      const minY = Math.min(current.y, next.y);
      const maxY = Math.max(current.y, next.y);

      // Check if point is on vertical edge
      if (point.x === current.x && point.y >= minY && point.y <= maxY) {
        return true;
      }

      // Check if ray crosses this vertical edge
      if (point.x < current.x && point.y > minY && point.y <= maxY) {
        inside = !inside;
      }
    } else {
      // Horizontal edge
      const minX = Math.min(current.x, next.x);
      const maxX = Math.max(current.x, next.x);

      // Check if point is on horizontal edge
      if (point.y === current.y && point.x >= minX && point.x <= maxX) {
        return true;
      }
    }
  }

  return inside;
}

function isRectangleWithinBoundary(boundary: Coordinates[], corner1: Coordinates, corner2: Coordinates) {
  // 2 of the corner is already on the boundary anyway. So our check should be for the remaining 2 vertices.
  const corner3 = { x: corner1.x, y: corner2.y };
  const corner4 = { x: corner2.x, y: corner1.y };

  return isPointWithinBoundary(boundary, corner3) && isPointWithinBoundary(boundary, corner4);
}

type RectangleBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

function getRectangleBounds(corner1: Coordinates, corner2: Coordinates): RectangleBounds {
  return {
    minX: Math.min(corner1.x, corner2.x),
    maxX: Math.max(corner1.x, corner2.x),
    minY: Math.min(corner1.y, corner2.y),
    maxY: Math.max(corner1.y, corner2.y),
  };
}

/**
 * Check if the rectangle collide with any edge of the polygon, using AABB collision detection.
 * @see https://en.wikipedia.org/wiki/Minimum_bounding_box#Axis-aligned_minimum_bounding_box
 */
function hasRectangleCollision(boundary: Coordinates[], corner1: Coordinates, corner2: Coordinates): boolean {
  const bounds = getRectangleBounds(corner1, corner2);
  const n = boundary.length;

  for (let i = 0; i < n; i++) {
    const current = boundary[i];
    const next = boundary[(i + 1) % n];

    const isHorizontalEdge = current.y === next.y;
    if (isHorizontalEdge) {
      const edgeY = current.y;
      const edgeMinX = Math.min(current.x, next.x);
      const edgeMaxX = Math.max(current.x, next.x);

      // Check if horizontal edge crosses through rectangle
      const edgeCrossesVertically = edgeY > bounds.minY && edgeY < bounds.maxY;
      const edgeOverlapsHorizontally = edgeMaxX > bounds.minX && edgeMinX < bounds.maxX;
      if (edgeCrossesVertically && edgeOverlapsHorizontally) {
        return true;
      }
    } else {
      const edgeX = current.x;
      const edgeMinY = Math.min(current.y, next.y);
      const edgeMaxY = Math.max(current.y, next.y);

      // Check if vertical edge crosses through rectangle
      const edgeCrossesHorizontally = edgeX > bounds.minX && edgeX < bounds.maxX;
      const edgeOverlapsVertically = edgeMaxY > bounds.minY && edgeMinY < bounds.maxY;
      if (edgeCrossesHorizontally && edgeOverlapsVertically) {
        return true;
      }
    }
  }

  return false;
}

function isRectangleValid(boundary: Coordinates[], corner1: Coordinates, corner2: Coordinates): boolean {
  return !hasRectangleCollision(boundary, corner1, corner2) && isRectangleWithinBoundary(boundary, corner1, corner2);
}

function part2(input: string[]) {
  let largestArea = 0;
  const redTiles = buildRedTilesMap(input);

  for (let i = 0; i < redTiles.length; i++) {
    for (let j = i + 1; j < redTiles.length; j++) {
      const check = isRectangleValid(redTiles, redTiles[i], redTiles[j]);
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
