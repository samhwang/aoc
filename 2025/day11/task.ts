import { parseInput } from '../src/parse-input';

const START_SIGNAL = 'you';
const END_SIGNAL = 'out';
const SERVER_SIGNAL = 'svr';
const DAC_SIGNAL = 'dac';
const FFT_SIGNAL = 'fft';

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

function findAllPathsContainPoint(map: Map<string, string[]>, start: string, end: string, requiredPoints: string[]): number {
  if (!map.has(start) && !map.has(end)) {
    return 0;
  }

  const requiredIndex = new Map<string, number>();
  requiredPoints.forEach((point, index) => {
    requiredIndex.set(point, index);
  });

  const fullMask = requiredPoints.length === 0 ? 0 : (1 << requiredPoints.length) - 1;
  const memo = new Map<string, number>();

  function traverse(current: string, mask: number, visited: Set<string>): number {
    const index = requiredIndex.get(current);
    const updatedMask = index !== undefined ? mask | (1 << index) : mask;

    if (current === end) {
      return updatedMask === fullMask ? 1 : 0;
    }

    const memoKey = `${current}-${updatedMask}`;
    const memoValue = memo.get(memoKey);
    if (memoValue !== undefined) {
      return memoValue;
    }

    if (visited.has(current)) {
      return 0;
    }
    visited.add(current);

    let count = 0;
    const endpoints = map.get(current) || [];
    for (const next of endpoints) {
      if (visited.has(next)) {
        continue;
      }
      count += traverse(next, updatedMask, visited);
    }

    visited.delete(current);
    memo.set(memoKey, count);
    return count;
  }

  return traverse(start, 0, new Set<string>());
}

function go(): void {
  console.time('task');

  console.time('parse-input');
  // const input = parseInput('./sample2.txt');
  const input = parseInput('./input.txt');
  const map = buildMap(input);
  console.timeEnd('parse-input');

  console.time('part 1');
  const res1 = findAllPaths(map, START_SIGNAL, END_SIGNAL, new Set());
  console.log('PART 1: ', res1);
  console.timeEnd('part 1');

  console.time('part 2');
  const res2 = findAllPathsContainPoint(map, SERVER_SIGNAL, END_SIGNAL, [DAC_SIGNAL, FFT_SIGNAL]);
  console.log('PART 2: ', res2);
  console.timeEnd('part 2');

  console.timeEnd('task');
}

go();
