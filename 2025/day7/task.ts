import { parseInput } from '../src/parse-input';

function solve(input: string[]) {
  const [startLine, ...nextLines] = input;
  const start = startLine.indexOf('S');
  if (start === -1) {
    throw new Error('Start not found');
  }

  let beamPositions = [start];

  // For part 1: If a split is encountered, append to this value
  let splitCount = 0;

  // For part 2: How the number of "realities" is calculated:
  // - Assuming the default weight of an index is undefined
  // - If a path goes through it, then its 1
  // - If a path meets a split, then remove said weight from the index, and take the current value and pass it to index + 1 and index - 1
  // - If an index can be hit by multiple splits, add the value from said splits together
  // - After iterating through the whole map, add up all of the "realities" at the end.
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

        // Part 2: Take the current path value from the index...
        const currentValue = pathValue.get(splitterIndex);
        if (!currentValue) {
          throw new Error(`Value not found for index ${splitterIndex}. THERE MUST BE A VALUE HERE!!!`);
        }

        if (splitterIndex > 0) {
          beamPositions.push(splitterIndex - 1);

          // Part 2: ...and pass to the left
          const leftValue = pathValue.get(splitterIndex - 1);
          if (!leftValue) {
            pathValue.set(splitterIndex - 1, currentValue);
          } else {
            pathValue.set(splitterIndex - 1, leftValue + currentValue);
          }
        }
        if (splitterIndex < line.length - 1) {
          beamPositions.push(splitterIndex + 1);

          // Part 2: and pass to the right
          const rightValue = pathValue.get(splitterIndex + 1);
          if (!rightValue) {
            pathValue.set(splitterIndex + 1, currentValue);
          } else {
            pathValue.set(splitterIndex + 1, rightValue + currentValue);
          }
        }

        // Part 1: Append split count
        splitCount++;

        // Part 2: clear the current index
        pathValue.delete(splitterIndex);
      }
    }
  });

  let paths = 0;
  const values = pathValue.values();
  for (const value of values) {
    paths += value;
  }

  return {
    splitCount,
    paths,
  };
}

function go(): void {
  console.time('task');

  console.time('parse-input');
  const input = parseInput('./input.txt');
  console.timeEnd('parse-input');

  console.time('SOLVE');
  const { splitCount, paths } = solve(input);
  console.timeEnd('SOLVE');

  const res1 = splitCount;
  console.log('PART 1: ', res1);

  const res2 = paths;
  console.log('PART 2: ', res2);

  console.timeEnd('task');
}

go();
