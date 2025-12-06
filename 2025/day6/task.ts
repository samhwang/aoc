import fs from 'node:fs';

function parseInput(inputPath: string) {
  const input = fs.readFileSync(inputPath, { encoding: 'utf-8' });
  return input.split('\n');
}

const PLUS = '+';
const MULTIPLY = '*';

function part1(input: string[]) {
  const operatorLine = input[input.length - 2];
  const numberLines = input.slice(0, input.length - 2);
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

function part2(input: string[]) {
  const operatorLine = input[input.length - 2];
  const numberLines = input.slice(0, input.length - 2);
  const operators = operatorLine.match(/[+*]/g);
  if (!operators) {
    throw new Error('Invalid input');
  }

  const numberGroups: number[][] = [];
  let currentGroup: number[] = [];
  const maxLineLength = Math.max(...numberLines.map((line) => line.length));
  for (let col = 0; col < maxLineLength; col++) {
    let currentNumString = '';
    for (let row = 0; row < numberLines.length; row++) {
      if (!numberLines[row][col]) {
        continue;
      }
      currentNumString += numberLines[row][col];
    }
    if (currentNumString.trim().length === 0) {
      numberGroups.push(currentGroup);
      currentGroup = [];
      continue;
    }
    const num = Number.parseInt(currentNumString.trim(), 10);

    currentGroup.push(num);
  }
  if (currentGroup.length > 0) {
    numberGroups.push(currentGroup);
  }

  return numberGroups.reduce((total, group, index) => {
    if (operators[index] === PLUS) {
      const subtotal = group.reduce((acc, num) => acc + num, 0);
      return total + subtotal;
    } else if (operators[index] === MULTIPLY) {
      const product = group.reduce((acc, num) => acc * num, 1);
      return total + product;
    } else {
      throw new Error('Invalid operator!');
    }
  }, 0);
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
