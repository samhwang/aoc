import { parseInput } from '../src/parse-input';

function buildRange(input: string[]) {
  const freshRanges: [number, number][] = [];
  const ingredients: number[] = [];

  input.forEach((line) => {
    if (line.length === 0) {
      return;
    }

    if (line.includes('-')) {
      const [start, end] = line.split('-').map((num) => Number.parseInt(num, 10)) as [number, number];
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
