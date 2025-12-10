import { parseInput } from '../src/parse-input';

type State = boolean[];
type Button = number[];
type Joltage = string; // Not parsed yet so leaving as string
type Config = {
  endState: State;
  buttons: Button[];
  joltage: Joltage;
};

function buildInput(input: string[]) {
  return input.map((line): Config => {
    const groups = line.split(' ');

    const indicatorGroup = groups[0];
    const indicator = indicatorGroup
      .replaceAll(/\[?\]?/g, '')
      .split('')
      .map((d) => d === '#');

    const buttonGroups = groups.slice(1, groups.length - 1);
    const buttons = buttonGroups.map((group) => {
      const buttonMatchers = group.match(/\d/g);
      if (!buttonMatchers) {
        throw new Error(`Invalid button group input ${group}!`);
      }

      return buttonMatchers.map((num) => Number.parseInt(num, 10)).sort((a, b) => a - b) as Button;
    });

    const joltageGroup = groups[groups.length - 1];
    const joltage = joltageGroup;

    return { endState: indicator, buttons, joltage };
  });
}

const binaryMapCache = new Map<number, State[]>();

function buildBinaryMap(length: number): boolean[][] {
  const currentCache = binaryMapCache.get(length);
  if (currentCache) {
    return currentCache;
  }

  const res: State[] = [];
  for (let i = 0; i < 2 ** length; i++) {
    const numAsState = i
      .toString(2)
      .padStart(length, '0')
      .split('')
      .map((d) => d === '1');
    res.push(numAsState);
  }
  binaryMapCache.set(length, res);
  return res;
}

function pressButtonBinary(currentState: State, button: Button) {
  const newState = [...currentState];
  for (const b of button) {
    newState[b] = !newState[b];
  }
  return newState;
}

function compareBinaryState(state1: State, state2: State) {
  if (state1.length !== state2.length) {
    return false;
  }

  for (let i = 0; i < state1.length; i++) {
    if (state1[i] !== state2[i]) {
      return false;
    }
  }
  return true;
}

function calculateMinNumberOfButtonPressesBinary({ endState, buttons }: Config): number {
  const steps: State[] = [];
  const binaryStates = buildBinaryMap(buttons.length);

  for (const bin of binaryStates) {
    let state: State = Array.from({ length: endState.length }, () => false);
    for (let binIndex = 0; binIndex < bin.length; binIndex++) {
      if (bin[binIndex]) {
        state = pressButtonBinary(state, buttons[binIndex]);
      }
    }
    if (compareBinaryState(state, endState)) {
      steps.push(bin.filter(btn => !!btn));
    }
  }

  return steps.sort((a, b) => a.length - b.length)[0].length;
}

/**
 * Assumming all switches are binary, i.e. only 1 signal is required to turn a light on
 */
function part1(input: string[]) {
  let totalPresses = 0;
  const list = buildInput(input);
  list.forEach(({ endState, buttons, joltage }) => {
    const buttonPresses = calculateMinNumberOfButtonPressesBinary({ endState, buttons, joltage });
    totalPresses += buttonPresses;
  });

  return totalPresses;
}

/**
 * Now the joltage comes to play. An indicate needs a specific amount of signal coming to turn the light on
 */
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
