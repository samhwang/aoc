import { parseInput } from '../src/parse-input';

type Coordinates = {
  x: number;
  y: number;
  z: number;
};

type Path = {
  start: Coordinates;
  end: Coordinates;
  distance: number;
};

class Circuit extends Set<Coordinates> {}

/**
 * calculate the Eucledian distance between 2 points in 3 dimensional space.
 * @see https://en.wikipedia.org/wiki/Euclidean_distance
 */
function calculateDistance(point1: Coordinates, point2: Coordinates): number {
  return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2 + (point1.z - point2.z) ** 2);
}

function buildPointsList(input: string[]) {
  return input.map((line) => {
    const matchers = line.match(/(\d+)/g);
    if (!matchers) throw new Error(`Invalid input: ${line}`);

    const [x, y, z] = matchers;
    return { x: Number.parseInt(x, 10), y: Number.parseInt(y, 10), z: Number.parseInt(z, 10) } satisfies Coordinates;
  });
}

function buildPathsList(points: Coordinates[]) {
  const paths: Path[] = [];
  points.forEach((start, index) => {
    const endPoints = points.slice(index + 1);
    endPoints.forEach((end) => {
      const distance = calculateDistance(start, end);
      paths.push({ start, end, distance });
    });
  });
  return paths.sort((a, b) => a.distance - b.distance);
}

function findCircuitsContainingPoint(circuits: Circuit[], point1: Coordinates, point2: Coordinates): { index: number; circuit: Circuit }[] {
  return circuits.reduce(
    (acc, circuit, index) => {
      if (circuit.has(point1) || circuit.has(point2)) {
        acc.push({ index, circuit });
      }
      return acc;
    },
    [] as { index: number; circuit: Circuit }[]
  );
}

function solve(input: string[], maxConnects?: number) {
  const points = buildPointsList(input);
  let connectsLeft = maxConnects;
  let circuits: Circuit[] = [];
  let lastPath: Path | undefined;

  const paths = buildPathsList(points);

  for (let index = 0; index < paths.length; index++) {
    const path = paths[index];

    if (connectsLeft === 0) {
      break;
    }

    if (circuits.length === 1 && circuits[0].size === points.length && !lastPath) {
      lastPath = paths[index - 1];
      break;
    }

    const { start, end } = path;

    const existingCircuits = findCircuitsContainingPoint(circuits, start, end);

    // No existing circuit, create new
    if (existingCircuits.length === 0) {
      const newCircuit = new Set([start, end]);
      circuits.push(newCircuit);
      connectsLeft && connectsLeft--;
      continue;
    }

    // If found only 1 circuit that contain either or both points, add the points to it
    if (existingCircuits.length === 1) {
      const existingCircuit = existingCircuits[0].circuit;
      existingCircuit.add(start);
      existingCircuit.add(end);
      connectsLeft && connectsLeft--;
      continue;
    }

    // Found more than 1, merge them together and splice out 1.
    // Since it's all gonna be merged together and we only look for 2 data points
    // there's no way it can be more than 2 here.
    const mergedCircuit = new Set([...existingCircuits[0].circuit, ...existingCircuits[1].circuit, start, end]);
    circuits.splice(existingCircuits[0].index, 1, mergedCircuit);
    circuits.splice(existingCircuits[1].index, 1);
    connectsLeft && connectsLeft--;
  }

  // Part 1: Sort the top 3 and multiply their length
  circuits = circuits.sort((a, b) => b.size - a.size);
  const res1 = circuits.length >= 3 ? circuits[0].size * circuits[1].size * circuits[2].size : 0;

  // Part 2: Find the last connection to make the circuit reach full length
  const res2 = lastPath ? lastPath.start.x * lastPath.end.x : 0;

  return { res1, res2 };
}

function go(): void {
  console.time('task');

  console.time('parse-input');
  // const input = parseInput('./sample.txt');
  const input = parseInput('./input.txt');
  console.timeEnd('parse-input');

  console.time('part 1');
  // const { res1 } = solve(input, 10);
  const { res1 } = solve(input, 1000);
  console.log('PART 1: ', res1);
  console.timeEnd('part 1');

  console.time('part 2');
  const { res2 } = solve(input);
  console.log('PART 2: ', res2);
  console.timeEnd('part 2');

  console.timeEnd('task');
}

go();
