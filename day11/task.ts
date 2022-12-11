interface Monkey {
  id: number;
  inspected: number;
  items: number[];
  operate: (old: number) => number;
  test: {
    divisible: number;
    ifTrue: Monkey['id'];
    ifFalse: Monkey['id'];
  };
}

type Operand = '+' | '*';

type SecondElem = 'old' | string;

function getMonkeyOperation(operand: Operand, secondElem: SecondElem): Monkey['operate'] {
  switch (operand) {
    case '+':
      return (old) => old + (secondElem === 'old' ? old : Number.parseInt(secondElem, 10));

    case '*':
      return (old) => old * (secondElem === 'old' ? old : Number.parseInt(secondElem, 10));
  }
}

function findModProduct(monkeys: Monkey[]) {
  return monkeys.reduce((accumulator, monkey) => {
    return accumulator * monkey.test.divisible;
  }, 1);
}

function monkeyTests(rounds: number, divideBy3 = true) {
  console.log(`Going through ${rounds} rounds of tests...`);
  const MONKEYS = Deno.readTextFileSync('./input.txt').split('\n\n').map<Monkey>((monkeyText) => {
      const [idLine, startingLine, opLine, testLine, trueLine, falseLine] = monkeyText.split('\n');

      const idString = idLine.substring('Monkey '.length, idLine.length - 1);
      const id = Number.parseInt(idString, 10);

      const startingItems = startingLine
        .substring('  Starting items: '.length)
        .split(', ')
        .map((num) => {
          return Number.parseInt(num, 10);
        });

      const operationArr = opLine
        .substring('  Operation: new = old '.length)
        .split(' ') as [Operand, SecondElem];
      const operation = getMonkeyOperation(...operationArr);

      const divisible = Number.parseInt(testLine.substring('  Test: divisible by '.length), 10);

      const ifTrue = Number.parseInt(trueLine.substring('    If true: throw to monkey '.length), 10);

      const ifFalse = Number.parseInt(falseLine.substring('    If false: throw to monkey '.length), 10);

      return {
        id,
        inspected: 0,
        items: startingItems,
        operate: operation,
        test: {
          divisible,
          ifTrue,
          ifFalse,
        },
      };
    });

  for (let round = 0; round < rounds; round++) {
    MONKEYS.forEach((monkey) => {
      [...monkey.items].forEach((item) => {
        const operatedWorryLevel = monkey.operate(item);
        const divisor = divideBy3 ? 3 : 1;
        const worryLevel = Math.floor(operatedWorryLevel / divisor);
        const monkeyTest = worryLevel % monkey.test.divisible === 0;
        const nextMonkeyId = monkeyTest ? monkey.test.ifTrue : monkey.test.ifFalse;
        const nextMonkey = MONKEYS[nextMonkeyId];
        nextMonkey.items.push(worryLevel % findModProduct(MONKEYS));
        monkey.items.shift();
        monkey.inspected++;
      });
    });
  }
  const inspectCount = MONKEYS.map((m) => m.inspected).sort((a, b) => b - a);
  const monkeyBusiness = inspectCount[0] * inspectCount[1];
  console.log({ inspectCount, monkeyBusiness });
}

// Task 1: Find monkey business level after 20 rounds
console.log('Task 1');
monkeyTests(20, true);

// Task 2: Find monkey business level after 10000 rounds
console.log('Task 2');
monkeyTests(10000, false);
