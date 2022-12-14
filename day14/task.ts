type Depth = number;
type Horizontal = number;
type Coordinates = [Depth, Horizontal];

const SAND_DROP_POINT: Coordinates = [0, 500];

const CHARS = {
  START: '+',
  AIR: '.',
  SAND: 'o',
  ROCK: '#',
};

function generateRockCoordinatesFromPath(rockPath: Coordinates[]) {
  const rockCoordinates: Coordinates[] = [...rockPath];
  for (let i = 0; i < rockPath.length - 1; i++) {
    const [depth1, horizontal1] = rockPath[i];
    const [depth2, horizontal2] = rockPath[i + 1];
    const sameRow = horizontal1 === horizontal2;
    if (sameRow) {
      for (
        let d = Math.min(depth1, depth2) + 1;
        d < Math.max(depth1, depth2);
        d++
      ) {
        rockCoordinates.push([d, horizontal1]);
      }
      continue;
    }

    const sameDepth = depth1 === depth2;
    if (sameDepth) {
      for (
        let h = Math.min(horizontal1, horizontal2) + 1;
        h < Math.max(horizontal1, horizontal2);
        h++
      ) {
        rockCoordinates.push([depth1, h]);
      }
    }
  }

  return rockCoordinates;
}

function generateMap(input: string) {
  let maxDepth = 0;
  const rockPaths = Deno.readTextFileSync(input)
    .split('\n')
    .map((line) => {
      return line.split(' -> ').map<Coordinates>((pair) => {
        const [horizontal, depth] = pair.split(',').map((i) => Number.parseInt(i));
        maxDepth = Math.max(maxDepth, depth);
        return [depth, horizontal];
      });
    });

  const map: string[][] = Array(maxDepth + 5)
    .fill(undefined)
    .map(() => CHARS.AIR.repeat(1000).split(''));

  // Sand drop point
  map[SAND_DROP_POINT[0]][SAND_DROP_POINT[1]] = CHARS.START;

  // Rock points
  const rockCoordinates = rockPaths.map((path) => generateRockCoordinatesFromPath(path)).flat();
  rockCoordinates.forEach((coords) => {
    const [depth, horizontal] = coords;
    map[depth][horizontal] = CHARS.ROCK;
  });

  return { map, maxDepth };
}

function addFloorToMap(map: string[][], floorDepth: number) {
  map[floorDepth] = map[floorDepth].map(() => CHARS.ROCK);
}

function isBlocked(map: string[][], depth: Depth, horizontal: Horizontal) {
  return map[depth][horizontal] !== CHARS.AIR;
}

function sandDrop(map: string[][], coordinates: Coordinates, maxDepth: number): boolean {
  if (coordinates[0] >= maxDepth) {
    return false;
  }

  const [depth, horizontal] = coordinates;
  const blockedBottom = isBlocked(map, depth + 1, horizontal);
  if (!blockedBottom) {
    map[depth][horizontal] = CHARS.AIR;
    map[depth + 1][horizontal] = CHARS.SAND;
    const newCoordinates: Coordinates = [depth + 1, horizontal];
    return sandDrop(map, newCoordinates, maxDepth);
  }

  const blockedBottomLeft = isBlocked(map, depth + 1, horizontal - 1);
  if (!blockedBottomLeft) {
    map[depth][horizontal] = CHARS.AIR;
    map[depth + 1][horizontal - 1] = CHARS.SAND;
    const newCoordinates: Coordinates = [depth + 1, horizontal - 1];
    return sandDrop(map, newCoordinates, maxDepth);
  }

  const blockBottomRight = isBlocked(map, depth + 1, horizontal + 1);
  if (!blockBottomRight) {
    map[depth][horizontal] = CHARS.AIR;
    map[depth + 1][horizontal + 1] = CHARS.SAND;
    const newCoordinates: Coordinates = [depth + 1, horizontal + 1];
    return sandDrop(map, newCoordinates, maxDepth);
  }

  return coordinates !== SAND_DROP_POINT;
}


// Task 1
function task1() {
  const { map, maxDepth } = generateMap('./input.txt');
  let sandCount = 0;
  while (sandDrop(map, SAND_DROP_POINT, maxDepth)) {
    sandCount += 1;
  }

  map.forEach((line) => console.log(line.join('')));
  return sandCount;
}
console.log('TASK 1');
const sandCount1 = task1();
console.log({ sandCount1 });

// Task 2
function task2() {
  const { map, maxDepth } = generateMap('./input.txt');
  const floorDepth = maxDepth + 2;
  addFloorToMap(map, floorDepth);
  let sandCount = 0;
  while (sandDrop(map, SAND_DROP_POINT, floorDepth)) {
    sandCount += 1;
  }

  map.forEach((line) => console.log(line.join('')));
  return sandCount + 1;
}
console.log('TASK 2');
const sandCount2 = task2();
console.log({ sandCount2 });
