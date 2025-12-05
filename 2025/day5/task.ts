import { parseInput } from '../src/parse-input';

type Range = [number, number];

function checkOverlappingRanges([start1, end1]: Range, [start2, end2]: Range): boolean {
  return start1 <= end2 && start2 <= end1;
}

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
    }, [] as Range[]);

  return {
    freshRanges: finalRanges,
    ingredients,
  };
}

function part1(freshRanges: Range[], ingredients: number[]) {
  return ingredients.filter((ingredient) => {
    return freshRanges.some(([start, end]) => ingredient >= start && ingredient <= end);
  }).length;
}

function part2(freshRanges: Range[]) {
  const finalRanges = freshRanges.reduce((accumulator, [start, end]) => {
    const numInRange = end - start + 1;
    return accumulator + numInRange;
  }, 0);
  return finalRanges;
}

function go(): void {
  console.time('task');

  console.time('parse-input');
  const input = parseInput('./input.txt');
  const { freshRanges, ingredients } = buildRange(input);
  console.timeEnd('parse-input');

  console.time('part 1');
  const res1 = part1(freshRanges, ingredients);
  console.log('PART 1: ', res1);
  console.timeEnd('part 1');

  console.time('part 2');
  const res2 = part2(freshRanges);
  console.log('PART 2: ', res2);
  console.timeEnd('part 2');

  console.timeEnd('task');
}

go();
