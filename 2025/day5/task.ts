import { parseInput } from '../src/parse-input';

type Range = [number, number];

function buildRange(input: string[]) {
  const freshRanges: Range[] = [];
  const ingredients: number[] = [];

  input.forEach((line) => {
    if (line.length === 0) {
      return;
    }

    if (line.includes('-')) {
      const [start, end] = line.split('-').map((num) => Number.parseInt(num, 10)) as Range;
      freshRanges.push([start, end]);
      return;
    }

    ingredients.push(Number.parseInt(line, 10));
  });
  return {
    freshRanges,
    ingredients,
  };
}

function part1(input: string[]) {
  const { freshRanges, ingredients } = buildRange(input);
  return ingredients.filter((ingredient) => {
    return freshRanges.some(([start, end]) => ingredient >= start && ingredient <= end);
  }).length;
}

function checkOverlappingRanges([start1, end1]: Range, [start2, end2]: Range): boolean {
  return start1 <= end2 && start2 <= end1;
}

function part2(input: string[]) {
  const { freshRanges } = buildRange(input);
  const finalRanges = freshRanges
    .sort(([start1], [start2]) => {
      return start1 - start2;
    })
    .reduce((accumulator, currentRange) => {
      if (accumulator.length === 0) {
        accumulator.push(currentRange);
      }

      const previousRange = accumulator[accumulator.length - 1];
      if (checkOverlappingRanges(previousRange, currentRange)) {
        accumulator[accumulator.length - 1] = [Math.min(previousRange[0], currentRange[0]), Math.max(previousRange[1], currentRange[1])];
      } else {
        accumulator.push(currentRange);
      }
      return accumulator;
    }, [] as Range[])
    .reduce((accumulator, [start, end]) => {
      const numInRange = end - start + 1;
      return accumulator + numInRange;
    }, 0);
  return finalRanges;
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
