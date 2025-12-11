import { type Arith, type Context, init } from 'z3-solver';

import { parseInput } from '../src/parse-input';

type ToggleState = boolean[];
type Button = number[];
type Joltage = number[];
type Target<TTarget extends ToggleState | Joltage> = {
  endState: TTarget;
  buttons: Button[];
};
type Config = {
  toggle: Target<ToggleState>;
  jolt: Target<Joltage>;
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

    return {
      toggle: {
        endState,
        buttons,
      },
      jolt: {
        endState: joltage,
        buttons: joltageButtons,
      },
    };
  });
}

const binaryMapCache = new Map<number, ToggleState[]>();

function buildBinaryStatesCache(length: number): boolean[][] {
  const currentCache = binaryMapCache.get(length);
  if (currentCache) {
    return currentCache;
  }

  const res: ToggleState[] = [];
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

function pressButtonToggle(currentState: ToggleState, button: Button) {
  const newState = [...currentState];
  for (const b of button) {
    newState[b] = !newState[b];
  }
  return newState;
}

function compareToggleState(state1: ToggleState, state2: ToggleState) {
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

function calculateMinNumberOfToggles({ endState, buttons }: Config['toggle']): number {
  const steps: ToggleState[] = [];
  const binaryStates = buildBinaryStatesCache(buttons.length);

  for (const bin of binaryStates) {
    let state: ToggleState = Array.from({ length: endState.length }, () => false);
    for (let binIndex = 0; binIndex < bin.length; binIndex++) {
      if (bin[binIndex]) {
        state = pressButtonToggle(state, buttons[binIndex]);
      }
    }
    if (compareToggleState(state, endState)) {
      steps.push(bin.filter((btn) => !!btn));
    }
  }

  return steps.sort((a, b) => a.length - b.length)[0].length;
}

/**
 * Each button is a toggle switch, works with first part of the input.
 * One push of a button sends a toggle signal to the light, and the light will then be flip on or off.
 * e.g. For an input like: [.##.] means light 1 and 2 needs to be hit once.
 */
function part1(input: string[]) {
  let totalPresses = 0;
  const list = buildInput(input);
  list.forEach(({ toggle }) => {
    const buttonPresses = calculateMinNumberOfToggles(toggle);
    totalPresses += buttonPresses;
  });

  return totalPresses;
}

async function calculateMinNumberOfButtonPressesWithJoltage({ endState, buttons }: Config['jolt'], context: Context): Promise<number> {
  const { Optimize, Int } = context;
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const solver = new Optimize();

  const vars: Arith[] = [];

  for (let i = 0; i < buttons.length; i++) {
    const value = Int.const(`${alphabet[i]}`);
    solver.add(value.ge(0));
    vars.push(value);
  }

  for (let x = 0; x < endState.length; x++) {
    let sum: Arith = Int.val(0);
    for (const [y, btn] of buttons.entries()) {
      if (btn[x] === 1) {
        sum = sum.add(vars[y]);
      }
    }
    const constraint = sum.eq(Int.val(endState[x]));
    solver.add(constraint);
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
 * Each button is now a counter switch, works with the last part of the input.
 * One push of the button sends 1 counter signal to the light. A specific light needs
 * to match their respective amount of counter signal to stay on.
 * e.g. for an input like {3,5,4,7}:
 * - light 0 needs 3
 * - light 1 needs 5
 * - light 2 needs 4
 * - light 3 needs 7
 */
async function part2(input: string[]) {
  const { Context } = await init();
  const list = buildInput(input);
  const totalPresses = await list.reduce(async (acc, { jolt }) => {
    const prev = await acc;
    const buttonPresses = await calculateMinNumberOfButtonPressesWithJoltage(jolt, Context('main'));
    return prev + buttonPresses;
  }, Promise.resolve(0));

  return totalPresses;
}

async function go(): Promise<void> {
  console.time('task');

  console.time('parse-input');
  // const input = parseInput('./sample.txt');
  const input = parseInput('./input.txt');
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
