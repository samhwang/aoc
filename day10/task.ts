type Instruction = 'noop' | `addx ${number}`;

const program = Deno
  .readTextFileSync('./input.txt')
  .split('\n') as Instruction[];

// Task 1: Calculate signal strength
const START_REGISTRY = 1;
const START_SIGNAL = START_REGISTRY;
let cycleCount = 1;
let currentRegistry = START_REGISTRY;
const signals = [START_SIGNAL];
function calculateSignalStrength(cycleCount: number, signal: number) {
  const is20 = cycleCount === 20;
  const divisibleBy40After20 = cycleCount > 20 && (cycleCount - 20) % 40 === 0;
  if (is20 || divisibleBy40After20) {
    return cycleCount * signal;
  }

  return signal;
}

program
  .map((line) => {
    if (line.indexOf('noop') > -1) {
      return [line];
    }

    return ['noop', line];
  })
  .flat()
  .forEach((instruction) => {
    const signal = calculateSignalStrength(cycleCount, currentRegistry);
    signals.push(signal);
    cycleCount = cycleCount + 1;

    if (instruction === 'noop') {
      return;
    }

    const [_, registryAsString] = instruction.split(' ');
    const registryToAdd = Number.parseInt(registryAsString, 10);
    currentRegistry = currentRegistry + registryToAdd;
  });
const totalStrengths = [20, 60, 100, 140, 180, 220].reduce((accum, index) => {
  return accum + signals[index];
}, 0);
console.log('TASK 1: ', { totalStrengths });

