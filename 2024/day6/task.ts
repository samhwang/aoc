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

type MapInfo = {
  obstacles: Coordinates[];
  startPosition: Coordinates;
  maxX: X;
  maxY: Y;
};
function parseMap(input: string[]): MapInfo {
  const maxY = input.length;
  const maxX = input[0].length;
  const obstacles: Coordinates[] = [];
  let startPosition: Coordinates = [0, 0];

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      const currentChar = input[y][x];
      if (currentChar !== Obstacle && currentChar !== Guard) {
        continue;
      }

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
    maxX,
    maxY,
  };
}

/**
 * p1: Count how many distinct positions before the guard left the area
 */
function findObstacleAtDirection([y, x]: Coordinates, direction: Direction, obstacles: Coordinates[]): Coordinates | undefined {
  const obstaclesInDirection = obstacles.filter((obs) => {
    switch (direction) {
      case 'N': {
        return obs[0] < y && obs[1] === x;
      }

      case 'S': {
        return obs[0] > y && obs[1] === x;
      }

      case 'E': {
        return obs[0] === y && obs[1] > x;
      }

      case 'W': {
        return obs[0] === y && obs[1] < x;
      }
    }
  });
  if (obstaclesInDirection.length === 0) {
    return undefined;
  }

  let nearest = obstaclesInDirection[0];
  let nearestSteps = Math.abs(nearest[0] - y) + Math.abs(nearest[1] - x) - 1;
  for (let i = 1; i < obstaclesInDirection.length; i++) {
    const obstacle = obstaclesInDirection[i];
    const steps = Math.abs(obstacle[0] - y) + Math.abs(obstacle[1] - x) - 1;
    if (nearestSteps > steps) {
      nearestSteps = steps;
      nearest = obstacle;
    }
  }

  return nearest;
}

function visitNodes(start: Coordinates, pathing: Coordinates, steps: number, existingNodes: Coordinates[]) {
  let currentCoordinates = start;

  for (let i = 1; i <= steps; i++) {
    currentCoordinates = [currentCoordinates[0] + pathing[0], currentCoordinates[1] + pathing[1]];
    const alreadyHasCoords = existingNodes.find((coords) => coords[0] === currentCoordinates[0] && coords[1] === currentCoordinates[1]);
    if (alreadyHasCoords) {
      continue;
    }
    existingNodes.push(currentCoordinates);
  }
}

function part1(mapInfo: MapInfo) {
  const { obstacles, startPosition, maxX, maxY } = mapInfo;
  const visited: Coordinates[] = [];
  let currentCoordinates: Coordinates = startPosition;
  let currentDirection: Direction = 'N';

  let isOutOfBounds = false;
  while (!isOutOfBounds) {
    const pathing = FacingCoordinates[currentDirection];
    let steps = 0;

    const nextObstacle = findObstacleAtDirection(currentCoordinates, currentDirection, obstacles);
    if (nextObstacle) {
      steps = Math.abs(nextObstacle[0] - currentCoordinates[0]) + Math.abs(nextObstacle[1] - currentCoordinates[1]) - 1;
      currentDirection = TurnRight[currentDirection];
      visitNodes(currentCoordinates, pathing, steps, visited);
      currentCoordinates = visited[visited.length - 1];
      continue;
    }

    switch (currentDirection) {
      case 'N': {
        steps = currentCoordinates[0];
        break;
      }
      case 'S': {
        steps = maxY - currentCoordinates[0] - 1;
        break;
      }
      case 'E': {
        steps = maxX - currentCoordinates[1] - 1;
        break;
      }
      case 'W': {
        steps = currentCoordinates[1];
        break;
      }
    }
    visitNodes(currentCoordinates, pathing, steps, visited);
    currentCoordinates = visited[visited.length - 1];
    isOutOfBounds = true;
  }

  return visited;
}

/**
 * p2: Count how many places where we can put a single trap in to make the guard go in circles.
 */

function part2(mapInfo: MapInfo, visited: Coordinates[]) {
  const { obstacles: startObstacles, startPosition } = mapInfo;
  const traps: Coordinates[] = [];

  /**
   * For a trap to change the guard's path, it has to be placed on the paths of the guard.
   */
  for (const trapCoordinates of visited) {
    const obstacles: Coordinates[] = [...startObstacles, trapCoordinates];
    const turnedAts: Coordinates[] = [];
    let guardCoordinates: Coordinates = startPosition;
    let currentDirection: Direction = 'N';
    let goOutOfBounds = false;
    while (!goOutOfBounds) {
      const nextObstacle = findObstacleAtDirection(guardCoordinates, currentDirection, obstacles);
      if (!nextObstacle) {
        goOutOfBounds = true;
        continue;
      }

      const pathing = FacingCoordinates[currentDirection];
      const oldCoordinates: Coordinates = guardCoordinates;
      const newCoordinates: Coordinates = [nextObstacle[0] - pathing[0], nextObstacle[1] - pathing[1]];
      guardCoordinates = newCoordinates;

      const stuckInPlace = newCoordinates[0] === oldCoordinates[0] && newCoordinates[1] === oldCoordinates[1];
      if (stuckInPlace) {
        currentDirection = TurnRight[currentDirection];
        continue;
      }

      const stuckInCircle = turnedAts.filter((turn) => turn[0] === guardCoordinates[0] && turn[1] === guardCoordinates[1]).length > 0;
      if (stuckInCircle) {
        traps.push(trapCoordinates);
        break;
      }

      turnedAts.push(guardCoordinates);
      currentDirection = TurnRight[currentDirection];
    }
  }

  return traps.length;
}

function go(): void {
  const input = parseInput('./input.txt');
  const mapInfo = parseMap(input);

  const visited = part1(mapInfo);
  console.log('PART 1: ', visited.length + 1);

  const res2 = part2(mapInfo, visited);
  console.log('PART 2: ', res2);
}

go();
