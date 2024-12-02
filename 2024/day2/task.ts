import { parseInput } from '../src/parse-input';

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

  let wholeReportWithinDetlta = true;
  for (let index = 0; index < report.length - 1; index++) {
    const currentScore = report[index];
    const nextScore = report[index + 1];
    const delta = Math.abs(currentScore - nextScore);
    wholeReportWithinDetlta = MIN_DELTA <= delta && MAX_DELTA >= delta;
    if (!wholeReportWithinDetlta) {
      break;
    }
  }

  return wholeReportWithinDetlta;
}

function isSafeReport(report: number[]): boolean {
  const isIncreasingOrDecreasing = isIncreasing(report) || isDecreasing(report);
  const withinDelta = isWithinDelta(report);
  return isIncreasingOrDecreasing && withinDelta;
}

function part1(input: string[]): number {
  return input.reduce((accum, line) => {
    if (line.trim().length === 0) {
      return accum;
    }

    const report = line.split(' ').map((score) => Number.parseInt(score, 10));
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
  const count = report.reduce((count, _score, index) => {
    const reportWithoutElem = [...report.slice(0, index), ...report.slice(index + 1)];
    const fixable = isSafeReport(reportWithoutElem);
    if (!fixable) {
      return count;
    }
    return count + 1;
  }, 0);

  return count > 0;
}

function part2(input: string[]): number {
  return input.reduce((accum, line) => {
    if (line.trim().length === 0) {
      return accum;
    }

    const report = line.split(' ').map((score) => Number.parseInt(score, 10));
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

function go() {
  const input = parseInput('./input.txt');

  const res1 = part1(input);
  console.log('PART 1: ', res1);

  const res2 = part2(input);
  console.log('PART 2: ', res2);
}

go();
