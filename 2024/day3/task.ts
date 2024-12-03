import { parseInput } from '../src/parse-input';

/**
 * p1: Find all the `mul(x,y)` instruction and add them together
 */

type MulText = `mul(${number},${number})`;
function calculateMul(mulText: MulText): number {
  const numbers = mulText.match(/(\d+)/g);
  if (!numbers) {
    throw new Error(`Invalid multext input. input is ${mulText}`);
  }

  const product = numbers.reduce((accum, num) => accum * Number.parseInt(num, 10), 1);
  return product;
}

function part1(input: string[]): number {
  const mulGroupRegex = /(mul)\((\d{1,3})\,(\d{1,3})\)/g;

  const total = input.reduce((accum, line) => {
    const matches = line.match(mulGroupRegex);
    if (!matches) {
      throw new Error(`Invalid line input. line is ${line}`);
    }

    const instructions = matches as MulText[];

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
  const total = input.reduce((totalAccum, line): number => {
    const matches = line.match(doDontMulRegex);
    if (!matches) {
      throw new Error(`Invalid line input. line is ${line}`);
    }

    const instructions = matches as (MulText | DoText | DontText)[];

    const subtotal = instructions.reduce((subtotalAccum, instruction) => {
      if (instruction === 'do()') {
        addToTotal = true;
        return subtotalAccum;
      }

      if (instruction === "don't()") {
        addToTotal = false;
        return subtotalAccum;
      }

      if (!addToTotal) {
        return subtotalAccum;
      }

      const product = calculateMul(instruction);
      return subtotalAccum + product;
    }, 0);

    return totalAccum + subtotal;
  }, 0);

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
