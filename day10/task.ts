type Instruction = 'noop' | `addx ${number}`;

const program = Deno
  .readTextFileSync('./input.txt')
  .split('\n')
  .map((line) => {
    if (line.indexOf('noop') > -1) {
      return [line];
    }

    return ['noop', line];
  })
  .flat() as Instruction[];

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

// Task 2: Render CRT from the input
const MAX_WIDTH = 40;
const MAX_HEIGHT = 6;
const PIXEL = {
  lit: '#',
  nonLit: '.',
};

function getSpriteLocation(registry: number) {
  return [registry - 1, registry, registry + 1];
}

const screen = Array(MAX_HEIGHT).fill(undefined).map(() => Array(MAX_WIDTH).fill(''));
let currentRow = 0;
let currentScan = 0;
currentRegistry = START_REGISTRY;
program
  .forEach((instruction) => {
    const spriteLocation = getSpriteLocation(currentRegistry);
    screen[currentRow][currentScan] = spriteLocation.includes(currentScan) ? PIXEL.lit : PIXEL.nonLit;
    currentRow = currentScan + 1 < MAX_WIDTH ? currentRow : currentRow + 1;
    currentScan = currentScan + 1 < MAX_WIDTH ? currentScan + 1 : 0;

    if (instruction === 'noop') {
      return;
    }

    const [_, registryAsString] = instruction.split(' ');
    const registryToAdd = Number.parseInt(registryAsString, 10);
    currentRegistry = currentRegistry + registryToAdd;
  });
console.log('Task 2: ');
screen.forEach((line) => console.log(line.join('')));
