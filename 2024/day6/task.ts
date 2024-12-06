import { parseInput } from '../src/parse-input';

const Guard = '^' as const;
const Obstacle = '#' as const;

type Y = number;
type X = number;
type Coordinates = [Y, X];
type Direction = 'N' | 'S' | 'E' | 'W';

const TurnRight: Record<Direction, Direction> = {
  N: 'E',
  E: 'S',
  S: 'W',
  W: 'N',
};

const FacingCoordinates: Record<Direction, Coordinates> = {
  N: [-1, 0],
  W: [0, -1],
  E: [0, 1],
  S: [1, 0],
};

function parseMap(input: string[]): { obstacles: Coordinates[]; startPosition: Coordinates } {
  const obstacles: Coordinates[] = [];
  let startPosition: Coordinates = [0, 0];

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      if (input[y][x] === Obstacle) {
        obstacles.push([y, x]);
        continue;
      }

      // This should only happen once.
      if (input[y][x] === Guard) {
        startPosition = [y, x];
      }
    }
  }

  return {
    obstacles,
    startPosition,
  };
}

function calculateNextCoordinates(coordinates: Coordinates, direction: Direction): Coordinates {
  const iterator = FacingCoordinates[direction];
  return [coordinates[0] + iterator[0], coordinates[1] + iterator[1]];
}

/**
 * p1: Count how many distinct positions before the guard left the area
 */
function outOfBounds([y, x]: Coordinates, maxX: X, maxY: Y) {
  const outYBounds = y >= maxY || y < 0;
  const outXBounds = x >= maxX || x < 0;
  return outYBounds || outXBounds;
}

function part1(input: string[]): number {
  const { obstacles, startPosition } = parseMap(input);
  const visited: Coordinates[] = [];
  let currentCoordinates: Coordinates = startPosition;
  let currentDirection: Direction = 'N';

  const maxY = input.length;
  const maxX = input[0].length;
  let isOutOfBounds = false;
  while (!isOutOfBounds) {
    const hasCurrentCoords = visited.filter((coords) => JSON.stringify(coords) === JSON.stringify(currentCoordinates)).length > 0
    if (!hasCurrentCoords) {
      visited.push(currentCoordinates);
    }

    const nextCoordinates = calculateNextCoordinates(currentCoordinates, currentDirection);
    const hasObstacle = obstacles.find((obs) => JSON.stringify(obs) === JSON.stringify(nextCoordinates));
    if (!hasObstacle) {
      currentCoordinates = nextCoordinates;
      isOutOfBounds = outOfBounds(currentCoordinates, maxX, maxY);
      continue;
    }

    currentDirection = TurnRight[currentDirection];
  }

  return visited.length;
}

function part2(input: string[]) {}

function go(): void {
  const input = parseInput('./input.txt');

  const res1 = part1(input);
  console.log('PART 1: ', res1);

  const res2 = part2(input);
  console.log('PART 2: ', res2);
}

go();
