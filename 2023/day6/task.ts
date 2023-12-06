import { parseInput } from '../src/parse-input';

type Race = { maxTime: number; recordDistance: number };
function parseRace1(input: string[]) {
  const parseLine = (line: string) =>
    line
      .substring(line.indexOf(':') + 1)
      .split(' ')
      .filter((item) => item !== '')
      .map((item) => Number.parseInt(item, 10));
  const timeLine = parseLine(input[0]);
  const distanceLine = parseLine(input[1]);

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
  const parseLine = (line: string) =>
    line
      .substring(line.indexOf(':') + 1)
      .split(' ')
      .filter((item) => item !== '')
      .join('');
  const timeLine = parseLine(input[0]);
  const distanceLine = parseLine(input[1]);

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
