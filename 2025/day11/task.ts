import { parseInput } from '../src/parse-input';

const START_SIGNAL = 'you';
const END_SIGNAL = 'out';

function buildMap(input: string[]) {
  const rackMap = new Map<string, string[]>();
  input.forEach((line) => {
    const matchers = line.match(/(\w+)/g);
    if (!matchers) {
      throw new Error('Invalid input');
    }

    const [start, ...end] = matchers;
    rackMap.set(start, end);
  });
  return rackMap;
}

function findAllPaths(map: Map<string, string[]>, current: string, end: string, visited: Set<string>): number {
  if (current === end) {
    return 1;
  }

  if (visited.has(current)) {
    return 0;
  }

  visited.add(current);

  let pathCount = 0;
  const endpoints = map.get(current) ?? [];
  for (const endpoint of endpoints) {
    pathCount += findAllPaths(map, endpoint, end, visited);
  }

  visited.delete(current);
  return pathCount;
}

function part1(input: string[]) {
  const map = buildMap(input);
  const endingPoints: string[] = [];
  map.forEach((ends, start) => {
    if (ends.includes(END_SIGNAL)) {
      endingPoints.push(start);
    }
  });

  return findAllPaths(map, START_SIGNAL, END_SIGNAL, new Set());
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
