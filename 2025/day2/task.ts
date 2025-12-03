import { parseInput } from '../src/parse-input';

type Range = [number, number];

function parseRange(input: string): Range[] {
  return input.split(',').map((range) => {
    return range.split('-').map((val) => Number.parseInt(val, 10)) as [number, number];
  });
}

function solve(ranges: Range[], matcher: RegExp) {
  let total = 0;
  ranges.forEach(([start, end]) => {
    for (let num = start; num <= end; num++) {
      const match = num.toString().match(matcher);
      if (!match) {
        continue;
      }

      total += num;
    }
  });
  return total;
}

function part1(ranges: Range[]) {
  const regex = /^(\d+)\1$/;
  return solve(ranges, regex);
}

function part2(ranges: Range[]) {
  const regex = /^(\d+?)\1+$/;
  return solve(ranges, regex);
}

function go(): void {
  console.time('task');

  console.time('parse-input');
  const input = parseInput('./input.txt');
  const ranges = parseRange(input[0]);
  console.timeEnd('parse-input');

  console.time('part 1');
  const res1 = part1(ranges);
  console.log('PART 1: ', res1);
  console.timeEnd('part 1');

  console.time('part 2');
  const res2 = part2(ranges);
  console.log('PART 2: ', res2);
  console.timeEnd('part 2');

  console.timeEnd('task');
}

go();
