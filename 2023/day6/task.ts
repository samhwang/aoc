import { parseInput } from '../src/parse-input';

type Race = { maxTime: number; recordDistance: number };
function parseRace1(input: string[]) {
  const timeLine = input[0]
    .substring(input[0].indexOf(':') + 1)
    .split(' ')
    .filter((item) => item !== '')
    .map((time) => Number.parseInt(time, 10));
  const distanceLine = input[1]
    .substring(input[1].indexOf(':') + 1)
    .split(' ')
    .filter((item) => item !== '')
    .map((distance) => Number.parseInt(distance, 10));

  const raceInput: Race[] = [];
  for (let i = 0; i < timeLine.length; i++) {
    raceInput.push({ maxTime: timeLine[i], recordDistance: distanceLine[i] });
  }

  return raceInput;
}

function calculateWinPossibilities({ maxTime, recordDistance }: Race): number {
  let sum = 0;
  for (let hold = 0; hold <= maxTime; hold++) {
    const speed = hold;
    const restTime = maxTime - hold;
    const distance = speed * restTime;
    const win = distance > recordDistance;
    if (win) {
      sum++;
    }
  }

  return sum;
}

function part1(input: string[]) {
  const raceInput = parseRace1(input);
  const winPossibilities = raceInput.map(calculateWinPossibilities);

  return winPossibilities.reduce((acc, curr) => acc * curr, 1);
}

function parseRace2(input: string[]): Race {
  const timeLine = input[0]
    .substring(input[0].indexOf(':') + 1)
    .split(' ')
    .filter((item) => item !== '')
    .join('');
  const distanceLine = input[1]
    .substring(input[1].indexOf(':') + 1)
    .split(' ')
    .filter((item) => item !== '')
    .join('');

  return {
    maxTime: Number.parseInt(timeLine, 10),
    recordDistance: Number.parseInt(distanceLine, 10),
  };
}

function part2(input: string[]) {
  const race = parseRace2(input);

  const winPossibilities = calculateWinPossibilities(race);
  return winPossibilities;
}

function go() {
  const input = parseInput('./input.txt');

  const res1 = part1(input);
  console.log('PART 1: ', res1);

  const res2 = part2(input);
  console.log('PART 2: ', res2);
}

go();
