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

function isWithinDelta(a: number, b: number): boolean {
  const MIN_DELTA = 1;
  const MAX_DELTA = 3;
  const delta = Math.abs(a - b);
  return MIN_DELTA <= delta && MAX_DELTA >= delta;
}

function reportWithinDelta(report: number[]): boolean {
  let wholeReportWithinDetlta = true;
  for (let index = 0; index < report.length - 1; index++) {
    const currentScore = report[index];
    const nextScore = report[index + 1];
    wholeReportWithinDetlta = isWithinDelta(currentScore, nextScore);
    if (!wholeReportWithinDetlta) {
      break;
    }
  }

  return wholeReportWithinDetlta;
}

function isSafeReport(report: number[]): boolean {
  const isIncreasingOrDecreasing = isIncreasing(report) || isDecreasing(report);
  const withinDelta = reportWithinDelta(report);
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

function part2(input: string[]) {}

function go() {
  const input = parseInput('./input.txt');

  const res1 = part1(input);
  console.log('PART 1: ', res1);

  const res2 = part2(input);
  console.log('PART 2: ', res2);
}

go();
