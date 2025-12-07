import { parseInput } from '../src/parse-input';

type Direction = 'L' | 'R';

function parseInstruction(instruction: string): { direction: Direction; steps: number } {
  const matches = instruction.match(/([LR])(\d+)/);
  if (!matches) throw new Error(`Invalid instruction: ${instruction}`);
  const direction = matches[1] as Direction;
  const steps = parseInt(matches[2], 10);
  return { direction, steps };
}

const START = 50;
const MIN = 0;
const MAX = 99;
const TOTAL = MAX + 1;

function solve(instructions: { direction: Direction; steps: number }[]) {
  let currentNumber = START;

  // Part 2: Count all occurences where the clicker go through a 0
  let landsAt0 = 0;

  // Part 1: Count all occurences where the clicker stops at a 0
  let stopsAt0 = 0;

  instructions.forEach(({ direction, steps }) => {
    for (let count = 0; count < steps; count++) {
      const move = direction === 'L' ? -1 : 1;
      currentNumber = (currentNumber + move) % TOTAL;

      if (currentNumber === MIN) {
        landsAt0++;
      }
    }

    if (currentNumber === MIN) {
      stopsAt0++;
    }
  });
  return { stopsAt0, landsAt0 };
}

function go(): void {
  console.time('task');

  console.time('solve');
  const input = parseInput('./input.txt');
  const instructions = input.map(parseInstruction);
  const { stopsAt0, landsAt0 } = solve(instructions);
  console.timeEnd('solve');

  const res1 = stopsAt0;
  console.log('PART 1: ', res1);

  const res2 = landsAt0;
  console.log('PART 2: ', res2);

  console.timeEnd('task');
}

go();
