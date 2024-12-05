import { parseInput } from '../src/parse-input';

/**
 * p1: Total all the middle value of all valid prints
 * Valid prints means every line is in correct order:
 * `a|b` means in all lines, `a` must be before `b`.
 * Assumption: All print lines are odd-counted, so there will always be a middle value.
 */
type Rule = { before: number; after: number };
function lineInCorrectOrder(print: number[], rules: Rule[]): boolean {
  for (let i = 0; i < print.length - 1; i++) {
    for (let j = i + 1; j < print.length; j++) {
      const breaksOrder = rules.filter((rule) => rule.after === print[i] && rule.before === print[j]);
      if (breaksOrder.length > 0) {
        return false;
      }
    }
  }

  return true;
}

function part1(input: string[]): number {
  let total = 0;
  const rules: Rule[] = [];

  for (const line of input) {
    if (line.length === 0) {
      continue;
    }

    if (line.includes('|')) {
      const [before, after] = line.split('|').map((value) => Number.parseInt(value, 10));
      rules.push({ before, after });
    }

    if (line.includes(',')) {
      const print = line.split(',').map((value) => Number.parseInt(value, 10));
      const isValid = lineInCorrectOrder(print, rules);
      if (!isValid) {
        continue;
      }
      const middleIndex = Math.floor(print.length / 2);
      const middleNum = print[middleIndex]
      total += middleNum;
    }
  }

  return total;
}

function part2(input: string[]) {}

function go(): void {
  const input = parseInput('./input.txt');

  const res1 = part1(input);
  console.log('PART 1: ', res1);

  const res2 = part2(input);
  console.log('PART 2: ', res2);
}

go();
