import { parseInput } from '../src/parse-input';

function part1(input: string[]) {
  const PLUS = '+';
  const MULTIPLY = '*';
  const operatorLine = input[input.length - 1];
  const numberLines = input.slice(0, input.length - 1);
  const operators = operatorLine.match(/[+*]/g);
  if (!operators) {
    throw new Error('Invalid input');
  }
  return numberLines
    .reduce((lineTotals, line, lineCount) => {
      const numbers = line.match(/(\d+)/g);
      if (!numbers) {
        return lineTotals;
      }

      numbers.forEach((numString, numIndex) => {
        const num = Number.parseInt(numString, 10);
        if (lineCount === 0) {
          lineTotals.push(num);
          return;
        }

        if (operators[numIndex] === PLUS) {
          lineTotals[numIndex] += num;
        } else if (operators[numIndex] === MULTIPLY) {
          lineTotals[numIndex] *= num;
        } else {
          throw new Error('Invalid operator');
        }
      });
      return lineTotals;
    }, [] as number[])
    .reduce((total, num) => total + num, 0);
}

function part2(input: string[]) {}

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
