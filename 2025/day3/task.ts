import { parseInput } from '../src/parse-input';

function solve(input: string[], maxLength: number) {
  return input.reduce((totalJoltage, line) => {
    const batteries = line.split('');
    let largestJoltage = '';
    // method:
    // - Find largest number first, it should be between index 0 and batteries.length - MAX_LENGTH
    // - Cut the string from the index of the previous number
    // - The next number should be the largest between index of the previous number and batteries.length - MAX_LENGTH + how_many_found_numbers
    // e.g. with MAX_LENGTH = 2, and a line has 15 chars `818181911112111`:
    // - Our first char searches between index 0 and 13, find the first index of the largest number (value: 9, index: 6).
    // - Cut the string from index 6, so we now have `11112111`
    // - Our second char searches between index 7 and the original index 14.
    let searchArray = batteries;
    while (largestJoltage.length < maxLength) {
      const endScanRange = searchArray.length - maxLength + largestJoltage.length + 1;
      const largestNumber = Math.max(...searchArray.slice(0, endScanRange).map((val) => Number.parseInt(val, 10)));
      const largestNumIndex = searchArray.findIndex((val) => Number.parseInt(val, 10) === largestNumber);
      searchArray = searchArray.slice(largestNumIndex + 1);
      largestJoltage += largestNumber.toString();
    }
    return totalJoltage + Number.parseInt(largestJoltage, 10);
  }, 0);
}

function part1(input: string[]) {
  const MAX_LENGTH = 2;
  return solve(input, MAX_LENGTH);
}

function part2(input: string[]) {
  const MAX_LENGTH = 12;
  return solve(input, MAX_LENGTH);
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
