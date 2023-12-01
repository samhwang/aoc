const lines = Deno.readTextFileSync('./input.txt')
  .split('\n');

const elves = lines.reduce<number[]>((accumulator, line) => {
  if (line.length === 0) {
    accumulator.push(0);
    return accumulator;
  }

  const last = accumulator.length - 1;
  const currentElfLoad = accumulator[last];
  const lineAsNum = Number.parseInt(line);
  accumulator[last] = currentElfLoad + lineAsNum;
  return accumulator;
}, [])
  .sort((a, b) => a - b);

// Find the most calorie elf
console.log('TASK 1');
const largest = elves[elves.length - 1];
console.log({ largest });

// The largest 3 Sum
console.log('TASK 2');
const top3 = elves.slice(-3).reduce((total, num) => total + num, 0);
console.log({ top3 });
