import { parseInput } from '../src/parse-input';

function part1(input: string) {
  const ranges = input.split(',').map((range) => {
    return range.split('-').map((val) => Number.parseInt(val, 10)) as [number, number];
  });
  let total = 0;
  ranges.forEach(([start, end]) => {
    for (let num = start; num <= end; num++) {
      const numAsString = num.toString()
      if (numAsString.length % 2 !== 0) {
        continue;
      }
      const part1 = numAsString.slice(0, numAsString.length / 2)
      const part2 = numAsString.slice(numAsString.length / 2)
      if (part1 === part2) {
        total += num
      }
    }
  })
  return total
}

function part2(input: string[]) {}

function go(): void {
  console.time('task');

  console.time('parse-input');
  const input = parseInput('./input.txt');
  console.timeEnd('parse-input');

  console.time('part 1');
  const res1 = part1(input[0]);
  console.log('PART 1: ', res1);
  console.timeEnd('part 1');

  console.time('part 2');
  const res2 = part2(input);
  console.log('PART 2: ', res2);
  console.timeEnd('part 2');

  console.timeEnd('task');
}

go();
