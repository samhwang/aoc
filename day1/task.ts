const elves = Deno.readTextFileSync('./input.txt')
  .split('\n')
  .reduce<number[]>((accumulator, line) => {
    const currentElfLoad = accumulator[accumulator.length - 1];

    if (line.length === 0) {
      accumulator.push(0);
      return accumulator;
    }

    const lineAsNum = Number.parseInt(line);
    accumulator[accumulator.length - 1] = currentElfLoad + lineAsNum;
    return accumulator;
  }, [])
  .sort((a, b) => a - b);

const lastElf = elves.length - 1;

// Find the most calorie elf
const largest = elves[lastElf];
console.log({ largest });

// The largest 3 Sum
const top3 = elves[lastElf] + elves[lastElf - 1] + elves[lastElf - 2];
console.log({ top3 });
