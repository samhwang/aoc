import { parseInput } from '../src/parse-input';

/**
 * p1: Find all the `mul(x,y)` instruction and add them together
 */

type MulText = `mul(${number},${number})`;
function calculateMul(mulText: MulText): number {
  const matches = mulText.matchAll(/(\d+)/g);
  const numbers = [...matches].map((val) => val[0]);
  const product = numbers.reduce((accum, num) => accum * Number.parseInt(num, 10), 1);
  return product;
}

function part1(input: string[]): number {
  const mulGroupRegex = /(mul)\((\d{1,3})\,(\d{1,3})\)/g;
  const total = input.reduce((accum, line) => {
    const matches = line.matchAll(mulGroupRegex);
    const instructions = [...matches].map((val) => val[0]) as MulText[];

    const subtotal = instructions.reduce((accum, mulText) => accum + calculateMul(mulText), 0);

    return accum + subtotal;
  }, 0);

  return total;
}

/**
 * p2: Same rule as d1, but now with `do()` and `don't()` instructions.
 * The `do()` will enable the next calculations, and the `don't()` will stop it.
 */
type DoText = `do()`;
type DontText = `don't()`;
function part2(input: string[]) {
  const doDontMulRegex = /((mul)\((\d{1,3})\,(\d{1,3})\))|(do)\(\)|(don\'t)\(\)/g;

  let addToTotal = true;
  let total = 0;
  for (const line of input) {
    const matches = line.matchAll(doDontMulRegex);
    const instructions = [...matches].map((val) => val[0]) as (MulText | DoText | DontText)[];

    for (const instruction of instructions) {
      if (instruction === 'do()') {
        addToTotal = true;
        continue;
      }

      if (instruction === "don't()") {
        addToTotal = false;
        continue;
      }

      if (!addToTotal) {
        continue;
      }

      const subtotal = calculateMul(instruction);
      total += subtotal;
    }
  }

  return total;
}

function go(): void {
  const input = parseInput('./input.txt');

  const res1 = part1(input);
  console.log('PART 1: ', res1);

  const res2 = part2(input);
  console.log('PART 2: ', res2);
}

go();
