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
      const middleNum = print[middleIndex];
      total += middleNum;
    }
  }

  return total;
}

/**
 * p2: For each incorrect order print that we found in p1, use the rules
 * to put them in the correct order. Then add up only the middle value of the
 * corrected lines.
 */
function correctThePrint(print: number[], rules: Rule[]) {
  let rulesToFollow = rules.filter(({ before, after }) => print.includes(before) && print.includes(after));
  let printClone = [...print];
  const result: number[] = [];

  while (printClone.length > 0) {
    for (let i = 0; i < printClone.length; i++) {
      const currentNum = printClone[i]
      const hasAfterRule = rulesToFollow.filter(({ after }) => after === currentNum)
      if (hasAfterRule.length === 0) {
        result.push(currentNum)
        printClone = printClone.filter((num) => num !== currentNum)
        rulesToFollow = rulesToFollow.filter(({ before }) => before !== currentNum)
      }
    }
  }

  return result;
}

function part2(input: string[]) {
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
      if (isValid) {
        continue;
      }
      const correctPrint = correctThePrint(print, rules);
      const middleIndex = Math.floor(correctPrint.length / 2);
      const middleNum = correctPrint[middleIndex];
      total += middleNum;
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
