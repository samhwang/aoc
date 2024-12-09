import { parseInput } from '../src/parse-input';

type Disk = (number | null)[];
function parseDisk(input: string): Disk {
  const disk: (number | null)[] = [];
  let fileBlockId = 0;

  for (let i = 0; i < input.length; i++) {
    const blockCount = Number.parseInt(input[i], 10);
    if (i % 2 === 0) {
      for (let j = 0; j < blockCount; j++) {
        disk.push(fileBlockId);
      }
      fileBlockId++;
      continue;
    }

    for (let j = 0; j < blockCount; j++) {
      disk.push(null);
    }
  }

  return disk;
}

function calculateChecksum(disk: Disk): number {
  let total = 0;
  for (let i = 0; i < disk.length; i++) {
    if (disk[i] === null) {
      continue;
    }

    total += (disk[i] as number) * i;
  }
  return total;
}

/**
 * p1: move the memory blocks to the left, 1 block at a time
 */

function findLastNumber(disk: Disk): number {
  let index = 0;
  for (let i = disk.length - 1; i >= 0; i--) {
    const num = disk[i];
    const isNumber = num !== null;
    if (!isNumber) {
      continue;
    }

    index = i;
    break;
  }

  return index;
}

function findFirstBlank(disk: Disk): number {
  let index = 0;
  for (let i = 0; i < disk.length; i++) {
    const char = disk[i];
    const isBlank = char === null;
    if (!isBlank) {
      continue;
    }

    index = i;
    break;
  }

  return index;
}

function part1(input: string) {
  const disk = parseDisk(input);
  let firstBlankIndex = findFirstBlank(disk);
  let lastNumIndex = findLastNumber(disk);
  while (firstBlankIndex < lastNumIndex) {
    disk[firstBlankIndex] = disk[lastNumIndex];
    disk[lastNumIndex] = null;
    firstBlankIndex = findFirstBlank(disk);
    lastNumIndex = findLastNumber(disk);
  }

  const checkSum = calculateChecksum(disk);
  return checkSum;
}

function part2(input: string) {}

function go(): void {
  console.time('task');

  console.time('parse-input');
  const input = parseInput('./input.txt')[0];
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
