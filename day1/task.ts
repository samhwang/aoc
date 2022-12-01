const rawData = Deno.readTextFileSync("./input.txt").split("\n");

let elves: number[] = [];
let currentElf = elves.length - 1;
let total = 0;
rawData.forEach((row) => {
  if (!row || row.length === 0) {
    elves.push(total);
    total = 0;
    currentElf += 1;
    return;
  }

  total += Number.parseInt(row);
});
elves = elves.sort((a, b) => a - b);

// Find the most calorie elf
const largest = elves[currentElf];
console.log({ largest });

// The largest 3 Sum
const top3 = elves[currentElf] + elves[currentElf - 1] + elves[currentElf - 2];
console.log({ top3 });
