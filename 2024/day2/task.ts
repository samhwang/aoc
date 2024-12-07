import { parseInput } from '../src/parse-input';

function parseReport(line: string): number[] {
  return line.split(' ').map((score) => Number.parseInt(score, 10));
}

/**
 * part 1: Find all safe reports
 * Safe reports are:
 * - All increasing or all decreasing
 * - Variants are only max differ by min 1 max 3.
 */

function isIncreasing(report: number[]): boolean {
  const sortedList = [...report].sort((a, b) => a - b);
  return JSON.stringify(report) === JSON.stringify(sortedList);
}

function isDecreasing(report: number[]): boolean {
  const sortedList = [...report].sort((a, b) => b - a);
  return JSON.stringify(report) === JSON.stringify(sortedList);
}

function isWithinDelta(report: number[]): boolean {
  const MIN_DELTA = 1;
  const MAX_DELTA = 3;

  let withinDelta = true;
  for (let index = 0; index < report.length - 1; index++) {
    const currentScore = report[index];
    const nextScore = report[index + 1];
    const delta = Math.abs(currentScore - nextScore);
    withinDelta = MIN_DELTA <= delta && MAX_DELTA >= delta;
    if (!withinDelta) {
      break;
    }
  }

  return withinDelta;
}

function isSafeReport(report: number[]): boolean {
  const isIncreasingOrDecreasing = isIncreasing(report) || isDecreasing(report);
  const withinDelta = isWithinDelta(report);
  return isIncreasingOrDecreasing && withinDelta;
}

function part1(input: string[]): number {
  return input.reduce((accum, line) => {
    const report = parseReport(line);

    const safeReport = isSafeReport(report);
    if (safeReport) {
      return accum + 1;
    }

    return accum;
  }, 0);
}

/**
 * p2: Same rule as part 1, but now with a dampener:
 * The dampener can remove 1 score to make the whole report safe again.
 */

function isFixable(report: number[]): boolean {
  let fixable = false;
  for (let index = 0; index < report.length; index++) {
    const reportWithoutElem = [...report.slice(0, index), ...report.slice(index + 1)];
    fixable = isSafeReport(reportWithoutElem);
    if (fixable) {
      break;
    }
  }
  return fixable;
}

function part2(input: string[]): number {
  return input.reduce((accum, line) => {
    const report = parseReport(line);

    const safeReport = isSafeReport(report);
    if (safeReport) {
      return accum + 1;
    }

    const fixable = isFixable(report);
    if (fixable) {
      return accum + 1;
    }

    return accum;
  }, 0);
}

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
