const [graph, instruction] = Deno.readTextFileSync('./input.txt').split('\n\n');

// Parse the graph into arrays holding the crates
// Find the title index, and find matching index in each line, because crates and title will line up in a column
type Crate = string;
type Stack = Map<string, Crate[]>;
const graphLines = graph.split('\n');
const stackIds = graphLines[graphLines.length - 1].split('').filter((char) => char !== ' ');
const stacks = stackIds.reduce<Stack>((stackMap, id) => {
  const indexOf = graphLines[graphLines.length - 1].indexOf(id);
  const crates = graphLines.reduce<string[]>((accum, line, currentIndex) => {
    if (currentIndex === graphLines.length - 1) {
      return accum;
    }
    const char = line.charAt(indexOf).trim();
    if (char === '') {
      return accum;
    }

    accum.unshift(char);
    return accum;
  }, []);
  stackMap.set(id, crates);
  return stackMap;
}, new Map());

// Parse the steps from the instruction
interface Step {
  move: number;
  from: string;
  to: string;
}

const steps = instruction.split('\n').map<Step>((line) => {
  // Instruction format: move A from B to C
  const moveIndex = line.indexOf('move');
  const fromIndex = line.indexOf('from');
  const toIndex = line.indexOf('to');
  return {
    move: Number.parseInt(line.substring(moveIndex + 5, fromIndex - 1)),
    from: line.substring(fromIndex + 5, toIndex - 1),
    to: line.substring(toIndex + 3),
  };
});

// Task 1: Move the crates 1 by 1
console.log('TASK 1');
const task1Stack = new Map(stacks);
steps.forEach((step) => {
  for (let i = 1; i <= step.move; i++) {
    const from = task1Stack.get(step.from)!;
    const to = task1Stack.get(step.to)!;
    const poppedElement = from.pop()!;
    to.push(poppedElement);
  }
});

let endString = '';
task1Stack.forEach((stack) => {
  endString += stack[stack.length - 1];
});
console.log({ endString });

// Task 2: Move all the crates at once
console.log('TASK 2');
const task2Stack = new Map(stacks);
steps.forEach((step) => {
  const from = task2Stack.get(step.from)!;
  const to = task2Stack.get(step.to)!;

  const poppedElements = from.slice(from.length - step.move);
  task2Stack.set(step.from, from.slice(0, from.length - step.move));
  to.push(...poppedElements);
});

endString = '';
task2Stack.forEach((stack) => {
  endString += stack[stack.length - 1];
});
console.log({ endString });
