import { parseInput } from '../src/parse-input';

function parseInstruction(instruction: string): { direction: 'L' | 'R'; steps: number } {
  const matches = instruction.match(/([LR])(\d+)/);
  if (!matches) throw new Error(`Invalid instruction: ${instruction}`);
  const direction = matches[1] as 'L' | 'R';
  const steps = parseInt(matches[2], 10);
  return { direction, steps };
}

function part1(input: string[]) {
  const instructions = input.map(parseInstruction);

  const START = 50;
  const MIN = 0;
  const MAX = 99;
  let currentNumber = START;
  let stopsAt0 = 0;

  instructions.forEach(({ direction, steps }) => {
    for (let count = 0; count < steps; count++) {
      const move = direction === 'L' ? -1 : 1;
      currentNumber += move;
      if (currentNumber < MIN) {
        currentNumber = MAX;
      } else if (currentNumber > MAX) {
        currentNumber = MIN;
      }
    }

    if (currentNumber === 0) {
      stopsAt0++;
    }
  });
  return stopsAt0;
}

function part2(input: string[]) {
  const instructions = input.map(parseInstruction);

  const START = 50;
  const MIN = 0;
  const MAX = 99;
  let currentNumber = START;
  let stopsAt0 = 0;

  instructions.forEach(({ direction, steps }) => {
    for (let count = 0; count < steps; count++) {
      const move = direction === 'L' ? -1 : 1;
      currentNumber += move;
      if (currentNumber < MIN) {
        currentNumber = MAX;
      } else if (currentNumber > MAX) {
        currentNumber = MIN;
      }
      if (currentNumber === 0) {
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
