import { parseInput } from '../src/parse-input';

type Disk = (number | null)[];

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

type FileBlockMeta = {
  size: number;
  firstIndex: number;
};
type Disk2 = {
  disk: Disk;
  fileBlocks: Record<number, FileBlockMeta>;
};
function parseDisk(input: string): Disk2 {
  const disk: (number | null)[] = [];
  let fileBlockId = 0;
  const fileBlocks: Record<number, FileBlockMeta> = {};

  for (let i = 0; i < input.length; i++) {
    const blockCount = Number.parseInt(input[i], 10);
    if (i % 2 === 0) {
      for (let j = 0; j < blockCount; j++) {
        disk.push(fileBlockId);
        if (!fileBlocks[fileBlockId]) {
          fileBlocks[fileBlockId] = {
            size: 0,
            firstIndex: disk.length - 1,
          };
        }
        fileBlocks[fileBlockId].size += 1;
      }
      fileBlockId++;
      continue;
    }

    for (let j = 0; j < blockCount; j++) {
      disk.push(null);
    }
  }

  return {
    disk,
    fileBlocks,
  };
}

function findFirstAvailableSpaceBlock(disk: Disk, size: number, firstIndex: number) {
  let indices: number[] = [];
  for (let i = 0; i < disk.length; i++) {
    if (indices.length === 0 && disk[i] !== null) {
      continue;
    }

    if (i >= firstIndex) {
      indices = [];
      break;
    }

    if (disk[i] !== null) {
      indices = [];
      continue;
    }

    indices.push(i);
    if (indices.length >= size) {
      break;
    }
  }

  return indices;
}

/**
 * p1: move the memory blocks to the left, 1 block at a time
 */
function part1(input: string) {
  const { disk, fileBlocks } = parseDisk(input);

  for (let [fileId, { size, firstIndex }] of Object.entries(fileBlocks).reverse()) {
    for (let i = firstIndex + size - 1; i >= firstIndex; i--) {
      const spaces = findFirstAvailableSpaceBlock(disk, 1, i)
      if (spaces.length === 0) {
        continue;
      }
      disk[spaces[0]] = Number.parseInt(fileId, 10);
      disk[i] = null
    }
  }

  const checkSum = calculateChecksum(disk);
  return checkSum;
}

/**
 * p2: move the memory blocks to the left, 1 program at a time. The program can only be moved
 * if there are enough spaces.
 */
function part2(input: string) {
  const { disk, fileBlocks } = parseDisk(input);

  for (const [fileId, { size, firstIndex }] of Object.entries(fileBlocks).reverse()) {
    const spaces = findFirstAvailableSpaceBlock(disk, size, firstIndex);
    if (spaces.length === 0) {
      continue;
    }
    for (let space = 0; space < size; space++) {
      disk[spaces[space]] = Number.parseInt(fileId, 10);
      disk[firstIndex + space] = null
    }
  }

  const checkSum = calculateChecksum(disk);
  return checkSum;
}

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
