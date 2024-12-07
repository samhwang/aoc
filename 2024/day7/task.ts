import { parseInput } from '../src/parse-input';

function joinNumbers(a: number, b: number): number {
  return Number.parseInt(`${a}${b}`, 10);
}

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

/**
 * p1: Find the equations that can add up to the number on the left.
 */
function checkIfAddUp1({ result, operands }: Equation): boolean {
  let doesAddUp = false;
  let scenarioId = 0;
  const operandsCount = operands.length;
  const operatorCount = operandsCount - 1;
  const OPERATORS = ['+', '*'] as const;
  const maxOperationLimit = OPERATORS.length ** operatorCount;

  while (!doesAddUp && scenarioId <= maxOperationLimit) {
    const operations = scenarioId.toString(OPERATORS.length).padStart(operatorCount, '0');
    const subtotal = operands.reduce((accumulator, num, index) => {
      if (index === 0) {
        return num;
      }

      const operationString = operations.slice(index - 1, index);
      const operationNum = Number.parseInt(operationString, 10) as 0 | 1;
      const operator = OPERATORS[operationNum];
      switch (operator) {
        case '*':
          return accumulator * num;

        case '+':
          return accumulator + num;
      }
    }, 0);
    doesAddUp = subtotal === result;
    scenarioId += 1;
  }

  return doesAddUp;
}

function part1(input: string[]): number {
  let totalSum = 0;
  for (const line of input) {
    const equation = parseIntoEquation(line);
    const correct = checkIfAddUp1(equation);
    if (correct) {
      totalSum += equation.result;
    }
  }
  return totalSum;
}

function checkIfAddUp2({ result, operands }: Equation): boolean {
  let doesAddUp = false;
  let scenarioId = 0;
  const operandsCount = operands.length;
  const operatorCount = operandsCount - 1;
  const OPERATORS = ['+', '*', '||'] as const;
  const maxOperationLimit = OPERATORS.length ** operatorCount;

  while (!doesAddUp && scenarioId <= maxOperationLimit) {
    const operations = scenarioId.toString(OPERATORS.length).padStart(operatorCount, '0');
    const subtotal = operands.reduce((accumulator, num, index) => {
      if (index === 0) {
        return num;
      }

      const operationString = operations.slice(index - 1, index);
      const operationNum = Number.parseInt(operationString, 10) as 0 | 1 | 2;
      const operator = OPERATORS[operationNum];
      switch (operator) {
        case '*':
          return accumulator * num;

        case '+':
          return accumulator + num;

        case '||':
          return joinNumbers(accumulator, num);
      }
    }, 0);
    doesAddUp = subtotal === result;
    scenarioId += 1;
  }

  return doesAddUp;
}

function part2(input: string[]): number {
  let totalSum = 0;
  for (const line of input) {
    const equation = parseIntoEquation(line);
    const correct = checkIfAddUp2(equation);
    if (correct) {
      totalSum += equation.result;
    }
  }
  return totalSum;
}

function go(): void {
  const input = parseInput('./input.txt');

  const res1 = part1(input);
  console.log('PART 1: ', res1);

  const res2 = part2(input);
  console.log('PART 2: ', res2);
}

go();
