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

function part1(instructions: { direction: Direction; steps: number }[]) {
  let currentNumber = START;
  let stopsAt0 = 0;

  instructions.forEach(({ direction, steps }) => {
    for (let count = 0; count < steps; count++) {
      const move = direction === 'L' ? -1 : 1;
      currentNumber = (currentNumber + move) % TOTAL;
    }

    if (currentNumber === MIN) {
      stopsAt0++;
    }
  });
  return stopsAt0;
}

function part2(instructions: { direction: Direction; steps: number }[]) {
  let currentNumber = START;
  let stopsAt0 = 0;

  instructions.forEach(({ direction, steps }) => {
    for (let count = 0; count < steps; count++) {
      const move = direction === 'L' ? -1 : 1;
      currentNumber = (currentNumber + move) % TOTAL;
      if (currentNumber === MIN) {
        stopsAt0++;
      }
    }
  });
  return stopsAt0;
}

function go(): void {
  console.time('task');

  console.time('parse-input');
  const input = parseInput('./input.txt');
  const instructions = input.map(parseInstruction);
  console.timeEnd('parse-input');

  console.time('part 1');
  const res1 = part1(instructions);
  console.log('PART 1: ', res1);
  console.timeEnd('part 1');

  console.time('part 2');
  const res2 = part2(instructions);
  console.log('PART 2: ', res2);
  console.timeEnd('part 2');

  console.timeEnd('task');
}

go();
