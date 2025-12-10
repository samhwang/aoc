import { type Arith, type Context, init } from 'z3-solver';

import { parseInput } from '../src/parse-input';

type State = boolean[];
type Button = number[];
type Joltage = number[];
type Config = {
  endState: State;
  buttons: Button[];
  joltage: Joltage;
  joltageButtons: Button[];
};

function buildInput(input: string[]) {
  return input.map((line): Config => {
    const groups = line.split(' ');

    const indicatorGroup = groups[0];
    const endState = indicatorGroup
      .replaceAll(/\[?\]?/g, '')
      .split('')
      .map((d) => d === '#');

    const joltageGroup = groups[groups.length - 1];
    const joltageMatcher = joltageGroup.match(/\d+/g);
    if (!joltageMatcher) {
      throw new Error(`Invalid joltage input ${joltageGroup}!`);
    }

    const joltage = joltageMatcher.map((num) => Number.parseInt(num, 10));
    const buttonGroups = groups.slice(1, groups.length - 1);
    const buttons = buttonGroups.map((group) => {
      const buttonMatchers = group.match(/\d/g);
      if (!buttonMatchers) {
        throw new Error(`Invalid button group input ${group}!`);
      }

      return buttonMatchers.map((num) => Number.parseInt(num, 10)).sort((a, b) => a - b) as Button;
    });

    const joltageButtons: Button[] = [];
    for (const b of buttons) {
      const sb: Button = [];
      for (let i = 0; i < joltage.length; i++) {
        sb.push(b.includes(i) ? 1 : 0);
      }
      joltageButtons.push(sb);
    }

    return { endState, buttons, joltage, joltageButtons };
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

function calculateMinNumberOfButtonPressesBinary({ endState, buttons }: Pick<Config, 'buttons' | 'endState'>): number {
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
      steps.push(bin.filter((btn) => !!btn));
    }
  }

  return steps.sort((a, b) => a.length - b.length)[0].length;
}

/**
 * Assumming all switches are binary, i.e. only 1 signal is required to turn a light on
 * e.g. For an input like: [.##.] means light 1 and 2 needs to be hit once.
 */
function part1(input: string[]) {
  let totalPresses = 0;
  const list = buildInput(input);
  list.forEach(({ endState, buttons }) => {
    const buttonPresses = calculateMinNumberOfButtonPressesBinary({ endState, buttons });
    totalPresses += buttonPresses;
  });

  return totalPresses;
}

async function calculateMinNumberOfButtonPressesWithJoltage(
  { joltageButtons, joltage }: Pick<Config, 'joltageButtons' | 'joltage'>,
  context: Context
): Promise<number> {
  const { Optimize, Int } = context;
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const solver = new Optimize();

  const vars: Arith[] = [];

  for (let i = 0; i < joltageButtons.length; i++) {
    const value = Int.const(`${alphabet[i]}`);
    solver.add(value.ge(0));
    vars.push(value);
  }

  for (let x = 0; x < joltage.length; x++) {
    let check = Int.val(0);
    for (const [y, btn] of joltageButtons.entries()) {
      if (btn[x] === 1) {
        check = check.add(vars[y]);
      }
    }
    check = check.eq(Int.val(joltage[x]));
    solver.add(check);
  }

  const sumVars = vars.reduce((accumulator, value) => accumulator.add(value), Int.val(0));
  solver.minimize(sumVars);

  const result = await solver.check();
  if (result === 'sat') {
    return Number.parseInt(solver.model().eval(sumVars).toString(), 10);
  } else {
    return 0;
  }
}

/**
 * Now the joltage comes to play. For a light to stay on, it needs to match the joltage.
 * e.g. for an input like {3,5,4,7}:
 * - light 0 needs 3
 * - light 1 needs 5
 * - light 2 needs 4
 * - light 3 needs 7
 */
async function part2(input: string[]) {
  const { Context } = await init();
  let totalPresses = 0;
  const list = buildInput(input);
  list.forEach(async ({ joltageButtons, joltage }) => {
    const buttonPresses = await calculateMinNumberOfButtonPressesWithJoltage({ joltageButtons, joltage }, Context('main'));
    totalPresses += buttonPresses;
  });

  return totalPresses;
}

async function go(): Promise<void> {
  console.time('task');

  console.time('parse-input');
  const input = parseInput('./sample.txt');
  console.timeEnd('parse-input');

  console.time('part 1');
  const res1 = part1(input);
  console.log('PART 1: ', res1);
  console.timeEnd('part 1');

  console.time('part 2');
  const res2 = await part2(input);
  console.log('PART 2: ', res2);
  console.timeEnd('part 2');

  console.timeEnd('task');
}

go();
