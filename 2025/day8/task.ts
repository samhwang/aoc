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

/**
 * calculate the Eucledian distance between 2 points in 3 dimensional space.
 * @see https://en.wikipedia.org/wiki/Euclidean_distance
 */
function calculateDistance(point1: Coordinates, point2: Coordinates): number {
  return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2 + (point1.z - point2.z) ** 2);
}

function buildPointsList(input: string[]) {
  return input
    .map((line) => {
      if (line.trim().length === 0) {
        return undefined;
      }

      const matchers = line.match(/(\d+)/g);
      if (!matchers) throw new Error(`Invalid input: ${line}`);

      const [x, y, z] = matchers;
      return { x: Number.parseInt(x, 10), y: Number.parseInt(y, 10), z: Number.parseInt(z, 10) } satisfies Coordinates;
    })
    .filter((num): num is Coordinates => num !== undefined);
}

function solve(input: string[], maxConnects?: number) {
  const points = buildPointsList(input);
  let connectsLeft = maxConnects;
  let circuits: Set<Coordinates>[] = [];
  let paths: Path[] = [];

  points.forEach((start, index) => {
    const endPoints = points.slice(index + 1);
    endPoints.forEach((end) => {
      const distance = calculateDistance(start, end);
      paths.push({ start, end, distance });
    });
  });
  paths = paths.sort((a, b) => a.distance - b.distance);

  paths.forEach((path) => {
    if (connectsLeft === 0) {
      return;
    }

    const { start, end } = path;

    let existingCircuits: Set<Coordinates>[] = [];
    let existingIndex: number[] = [];
    for (let circuitIndex = 0; circuitIndex < circuits.length; circuitIndex++) {
      const currentCircuit = circuits[circuitIndex];
      if (currentCircuit.has(start) || currentCircuit.has(end)) {
        existingCircuits.push(currentCircuit);
        existingIndex.push(circuitIndex);
      }
    }

    if (existingCircuits.length === 0) {
      const newCircuit = new Set([start, end]);
      circuits.push(newCircuit);
      connectsLeft && connectsLeft--;
      existingCircuits = [];
      existingIndex = [];
      return;
    }

    if (existingCircuits.length === 1) {
      const existingCircuit = existingCircuits[0];
      existingCircuit.add(start);
      existingCircuit.add(end);
      connectsLeft && connectsLeft--;
      existingCircuits = [];
      existingIndex = [];
      return;
    }

    const mergedCircuit = new Set([...existingCircuits[0], ...existingCircuits[1], start, end]);
    circuits.push(mergedCircuit);
    circuits.splice(existingIndex[0], 1);
    circuits.splice(existingIndex[1] - 1, 1);
    connectsLeft && connectsLeft--;
    existingCircuits = [];
    existingIndex = [];
  });

  // Part 1: Sort the top 3 and multiply their length
  circuits = circuits.sort((a, b) => b.size - a.size);
  const res1 = circuits.length > 1 ? circuits[0].size * circuits[1].size * circuits[2].size : 0;

  return { res1 };
}

function go(): void {
  console.time('task');

  console.time('parse-input');
  const input = parseInput('./input.txt');
  console.timeEnd('parse-input');

  console.time('part 1');
  // const { res1 } = solve(input, 10);
  const { res1 } = solve(input, 1000);
  console.log('PART 1: ', res1);
  console.timeEnd('part 1');

  console.time('part 2');
  const res2 = part2(input);
  console.log('PART 2: ', res2);
  console.timeEnd('part 2');

  console.timeEnd('task');
}

go();
