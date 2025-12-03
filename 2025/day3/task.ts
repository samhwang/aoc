import { parseInput } from '../src/parse-input';

function part1(input: string[]) {
  return input.reduce((totalJoltage, line) => {
    const batteries = line.split('');
    let largestJoltage = 0;
    for (let a = 0; a < batteries.length; a++) {
      for (let b = a + 1; b < batteries.length; b++) {
        const number = Number.parseInt(`${batteries[a]}${batteries[b]}`, 10);
        largestJoltage = Math.max(largestJoltage, number);
      }
    }
    return totalJoltage + largestJoltage;
  }, 0)
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
