type Instruction = 'noop' | `addx ${number}`;

const program = Deno
  .readTextFileSync('./input.txt')
  .split('\n')
  .map<Instruction[]>((line) => {
    if (line === 'noop') {
      return [line];
    }

    // Since an `addx` instruction takes 2 cycles to complete
    // It's executing a `noop` first then the actual `addx` instruction.
    return ['noop', line as Instruction];
  })
  .flat();

// Task 1: Calculate signal strength
const SAMPLES = [20, 60, 100, 140, 180, 220];
let cycleCount = 1;
let currentRegistry = 1;
let signalStrength = 0;

function calculateSignalStrength(cycleCount: number, signal: number) {
  const is20 = cycleCount === 20;
  const divisibleBy40After20 = cycleCount > 20 && (cycleCount - 20) % 40 === 0;
  if (is20 || divisibleBy40After20) {
    return cycleCount * signal;
  }

  return signal;
}

// Task 2: Render CRT
const MAX_WIDTH = 40;
const MAX_HEIGHT = 6;
const screen = Array(MAX_HEIGHT).fill(undefined).map(() => Array(MAX_WIDTH).fill(''));

const PIXEL = Object.freeze({
  lit: '#',
  nonLit: '.',
});

function getSpriteLocation(registry: number) {
  return [registry - 1, registry, registry + 1];
}
let currentRow = 0;
let currentScan = 0;

program
  .forEach((instruction) => {
    // Task 1: Calculate CPU signal strength
    if (SAMPLES.includes(cycleCount)) {
      const signal = calculateSignalStrength(cycleCount, currentRegistry);
      signalStrength = signalStrength + signal;
    }
    cycleCount = cycleCount + 1;

    // Task 2: Render CRT
    const spriteLocation = getSpriteLocation(currentRegistry);
    screen[currentRow][currentScan] = spriteLocation.includes(currentScan) ? PIXEL.lit : PIXEL.nonLit;
    if (currentScan + 1 < MAX_WIDTH) {
      currentScan = currentScan + 1;
    } else {
      currentRow = currentRow + 1;
      currentScan = 0;
    }

    // Iterate the rest of the loop
    if (instruction === 'noop') {
      return;
    }

    const [_, registryAsString] = instruction.split(' ');
    const registryToAdd = Number.parseInt(registryAsString, 10);
    currentRegistry = currentRegistry + registryToAdd;
  });

console.log('TASK 1: ', { signalStrength });
console.log('TASK 2: ');
screen.forEach((line) => console.log(line.join('')));
