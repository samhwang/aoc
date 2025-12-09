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
function checkVertexWithinboundary(boundary: Coordinates[], tile: Coordinates): boolean {
  let inside = false;
  const n = boundary.length;

  for (let i = 0; i < n; i++) {
    const current = boundary[i];
    const next = boundary[(i + 1) % n];

    // Check if the edge is vertical (x values are the same)
    if (current.x === next.x) {
      // Vertical edge - check if tile's x matches and y is within range
      if (tile.x === current.x) {
        const minY = Math.min(current.y, next.y);
        const maxY = Math.max(current.y, next.y);
        if (tile.y >= minY && tile.y <= maxY) {
          return true; // Point is on the edge
        }
      }

      // Check if ray crosses this vertical edge
      if (tile.x < current.x) {
        const minY = Math.min(current.y, next.y);
        const maxY = Math.max(current.y, next.y);
        if (tile.y > minY && tile.y <= maxY) {
          inside = !inside;
        }
      }
    } else {
      // Horizontal edge (y values are the same)
      const minX = Math.min(current.x, next.x);
      const maxX = Math.max(current.x, next.x);

      // Check if tile is on the edge
      if (tile.y === current.y && tile.x >= minX && tile.x <= maxX) {
        return true; // Point is on the edge
      }

      // Horizontal edges don't affect the ray cast count
      // (ray is cast horizontally, so it runs parallel to horizontal edges)
    }
  }

  return inside;
}

function checkRectangleWithinboundary(boundary: Coordinates[], tile1: Coordinates, tile2: Coordinates) {
  // 2 of the vertices is already on the boundary anyway. So our check should be for the remaining 2 vertices.
  const vertex1 = { x: tile1.x, y: tile2.y };
  const vertex2 = { x: tile2.x, y: tile1.y };

  return checkVertexWithinboundary(boundary, vertex1) && checkVertexWithinboundary(boundary, vertex2);
}

/**
 * Check if the rectangle collide with any edge of the polygon, using AABB collision detection.
 * @see https://en.wikipedia.org/wiki/Minimum_bounding_box#Axis-aligned_minimum_bounding_box
 */
function hasRectangleCollision(boundary: Coordinates[], corner1: Coordinates, corner2: Coordinates): boolean {
  // Get rectangle boundaries
  const rectMinX = Math.min(corner1.x, corner2.x);
  const rectMaxX = Math.max(corner1.x, corner2.x);
  const rectMinY = Math.min(corner1.y, corner2.y);
  const rectMaxY = Math.max(corner1.y, corner2.y);

  const n = boundary.length;

  for (let i = 0; i < n; i++) {
    const current = boundary[i];
    const next = boundary[(i + 1) % n];

    // Get edge boundaries
    const edgeMinX = Math.min(current.x, next.x);
    const edgeMaxX = Math.max(current.x, next.x);
    const edgeMinY = Math.min(current.y, next.y);
    const edgeMaxY = Math.max(current.y, next.y);

    // Check if edge is horizontal
    if (current.y === next.y) {
      const edgeY = current.y;

      // Check if horizontal edge crosses through rectangle (not just touching)
      // Edge must be within rectangle's Y range (exclusive of boundaries)
      if (edgeY > rectMinY && edgeY < rectMaxY) {
        // Check if edge's X range overlaps with rectangle's X range
        if (edgeMaxX > rectMinX && edgeMinX < rectMaxX) {
          return true; // Collision detected
        }
      }
    } else {
      // Edge is vertical
      const edgeX = current.x;

      // Check if vertical edge crosses through rectangle (not just touching)
      // Edge must be within rectangle's X range (exclusive of boundaries)
      if (edgeX > rectMinX && edgeX < rectMaxX) {
        // Check if edge's Y range overlaps with rectangle's Y range
        if (edgeMaxY > rectMinY && edgeMinY < rectMaxY) {
          return true; // Collision detected
        }
      }
    }
  }

  return false; // No collision
}

function isRectangleValid(boundary: Coordinates[], corner1: Coordinates, corner2: Coordinates): boolean {
  return !hasRectangleCollision(boundary, corner1, corner2) && checkRectangleWithinboundary(boundary, corner1, corner2);
}

function part2(input: string[]) {
  let largestArea = 0;
  const redTiles = buildRedTilesMap(input);

  // Procedure:
  // - For each pair of red tiles, find the 4 vertices of the rectangle
  // - Check if the 4 edges are in the boundary and if it collides
  // - If not, skip calculation
  // - If yes, continue calculation and compare with `largestArea`
  for (let i = 0; i < redTiles.length; i++) {
    for (let j = i + 1; j < redTiles.length; j++) {
      if (i === redTiles.length - 1) {
        j = 0;
      }
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
