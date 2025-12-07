import { parseInput } from '../src/parse-input';

function part1(input: string[]) {
  const [startLine, ...nextLines] = input;
  const start = startLine.indexOf('S');
  let beamPositions = [start];
  let splitCount = 0;
  nextLines.forEach((line) => {
    const matches = [...line.matchAll(/\^/g)];
    if (matches.length === 0) {
      return;
    }

    for (const match of matches) {
      const splitterIndex = match.index;
      if (beamPositions.includes(splitterIndex)) {
        beamPositions = beamPositions.filter((pos) => pos !== splitterIndex);
        if (splitterIndex > 0) {
          beamPositions.push(splitterIndex - 1);
        }
        if (splitterIndex < line.length - 1) {
          beamPositions.push(splitterIndex + 1);
        }
        splitCount++;
      }
    }
  });
  return splitCount;
}

function part2(input: string[]) {
  const [startLine, ...nextLines] = input;
  const start = startLine.indexOf('S');

  // How the number of "realities" is calculated:
  // - Assuming the default weight of an index is 0
  // - If a path goes through it, then its 1
  // - If a path meets a split, then remove said weight from the index, and take the current value and pass it to index + 1 and index - 1
  // - If an index can be hit by multiple splits, add the value from said splits together
  // - After iterating through the whole map, add up all of the "realities" at the end.

  let beamPositions = [start];
  const pathValue = new Map<number, number>();
  pathValue.set(start, 1);
  nextLines.forEach((line) => {
    const matches = [...line.matchAll(/\^/g)];
    if (matches.length === 0) {
      return;
    }

    for (const match of matches) {
      const splitterIndex = match.index;
      if (beamPositions.includes(splitterIndex)) {
        beamPositions = beamPositions.filter((pos) => pos !== splitterIndex);
        const currentValue = pathValue.get(splitterIndex);
        if (!currentValue) {
          throw new Error(`Value not found for index ${splitterIndex}. THERE MUST BE A VALUE HERE!!!`);
        }
        if (splitterIndex > 0) {
          beamPositions.push(splitterIndex - 1);
          const leftValue = pathValue.get(splitterIndex - 1);
          if (!leftValue) {
            pathValue.set(splitterIndex - 1, currentValue);
          } else {
            pathValue.set(splitterIndex - 1, leftValue + currentValue);
          }
        }
        if (splitterIndex < line.length - 1) {
          beamPositions.push(splitterIndex + 1);
          const rightValue = pathValue.get(splitterIndex + 1);
          if (!rightValue) {
            pathValue.set(splitterIndex + 1, currentValue);
          } else {
            pathValue.set(splitterIndex + 1, rightValue + currentValue);
          }
        }
        pathValue.delete(splitterIndex);
      }
    }
  });
  let paths = 0;
  const values = pathValue.values();
  for (const value of values) {
    paths += value;
  }
  return paths;
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
