import { parseInput } from '../src/parse-input';

type Equation = {
  result: number;
  operands: number[];
};
function parseIntoEquation(line: string): Equation {
  const matches = line.match(/(\d+)/g);

  if (!matches) {
    throw new Error('Invalid line!');
  }

  return {
    result: Number.parseInt(matches[0], 10),
    operands: matches.slice(1).map((v) => Number.parseInt(v, 10)),
  };
}

type Operations = Record<string, (a: number, b: number) => number>;

function joinNumbers(a: number, b: number): number {
  return Number.parseInt(`${a}${b}`, 10);
}

function addNumbers(a: number, b: number): number {
  return a + b;
}

function multiplyNumbers(a: number, b: number): number {
  return a * b;
}

/**
 * p1: Find the equations that can add up to the number on the left.
 */
function checkIfAddUp({ result, operands }: Equation, operations: Operations): boolean {
  let doesAddUp = false;
  let scenarioId = 0;
  const operandsCount = operands.length;
  const operatorCount = operandsCount - 1;
  const operatorSymbols = Object.keys(operations);
  const operationCount = operatorSymbols.length;
  const maxOperationLimit = operationCount ** operatorCount;

  while (!doesAddUp && scenarioId <= maxOperationLimit) {
    const operationSequence = scenarioId.toString(operationCount).padStart(operatorCount, '0');
    const subtotal = operands.slice(1).reduce((accumulator, num, index) => {
      const operationString = operationSequence.slice(index, index + 1);
      const operationNum = Number.parseInt(operationString, 10);
      const operator = operatorSymbols[operationNum];
      const operationFunc = operations[operator];
      return operationFunc(accumulator, num);
    }, operands[0]);
    doesAddUp = subtotal === result;
    scenarioId += 1;
  }

  return doesAddUp;
}

function checkReport(input: string[], operations: Operations): number {
  let totalSum = 0;
  for (const line of input) {
    const equation = parseIntoEquation(line);
    const correct = checkIfAddUp(equation, operations);
    if (correct) {
      totalSum += equation.result;
    }
  }
  return totalSum;
}

function part1(input: string[]): number {
  const operations: Operations = {
    '+': addNumbers,
    '*': multiplyNumbers,
  };
  return checkReport(input, operations);
}

function part2(input: string[]): number {
  const operations: Operations = {
    '+': addNumbers,
    '*': multiplyNumbers,
    '||': joinNumbers,
  };
  return checkReport(input, operations);
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
