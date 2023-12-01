import fs from 'node:fs';
import path from 'node:path';

function parseInput(): string[] {
  const inputPath = path.resolve('.', 'input.txt');
  const input = fs.readFileSync(inputPath, { encoding: 'utf-8' });
  return input.split('\n');
}

function getNumberFromLine1(line: string): number {
  const digits = line.split('').reduce(
    (acc, char) => {
      const charToNumber = Number.parseInt(char, 10);
      if (Number.isNaN(charToNumber)) {
        return acc;
      }

      acc.push(charToNumber);
      return acc;
    },
    [] as number[]
  );
  return Number.parseInt(`${digits[0]}${digits[digits.length - 1]}`, 10);
}

function part1(input: string[]): number {
  return input.reduce((acc, line) => {
    const result = getNumberFromLine1(line);
    console.log({ result });
    return acc + getNumberFromLine1(line);
  }, 0);
}

async function go() {
  const input = parseInput();

  const res1 = part1(input);
  console.log('PART 1: ', res1);

  const res2 = part2(input);
  console.log('PART 2: ', res2);
}

go();
