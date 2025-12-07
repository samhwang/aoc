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
          beamPositions.push(splitterIndex + 1);
        }
        if (splitterIndex < line.length - 1) {
          beamPositions.push(splitterIndex - 1);
        }
        splitCount++;
      }
    }
    beamPositions = [...new Set(beamPositions.sort((a, b) => a - b))];
  });
  return splitCount;
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
