const lines = Deno.readTextFileSync('./input.txt').split('\n');

type DirTree = Record<string, number[]>;

// Parse the directory tree
function mapOutTree(lines: string[]) {
  let currentDir = '/';
  const tree: DirTree = {
    '/': [],
  };
  lines.forEach((line) => {
    if (line.includes('$ ls')) {
      return;
    }

    if (line.includes('$ cd /')) {
      currentDir = '/';
      return;
    }

    if (line.includes('$ cd ..')) {
      currentDir = currentDir.substring(0, currentDir.lastIndexOf('/'));
      if (currentDir.length === 0) {
        currentDir = '/';
      }
      return;
    }

    if (line.includes('$ cd')) {
      const path = line.substring('$ cd '.length);
      const slashPath = currentDir === '/' ? '' : '/';
      currentDir = currentDir + slashPath + path;
      return;
    }

    if (line.includes('dir ')) {
      const dirName = line.substring('dir '.length);
      const slashPath = currentDir === '/' ? '' : '/';
      const currentPath = currentDir + slashPath + dirName;
      if (!(currentPath in tree)) {
        tree[currentPath] = [];
      }
      return;
    }

    // Should be fileSize fileName now
    const [size] = line.split(' ');
    const files = tree[currentDir];
    tree[currentDir] = [...files, Number.parseInt(size)];
  });
  return tree;
}
const tree = mapOutTree(lines);

function rollup(values: number[]) {
  return values.reduce((a, v) => a + v, 0);
}

function calculateTreeSize(tree: DirTree) {
  return Object.entries(tree).reduce<Record<string, number>>((accum, [key, values]) => {
    if (key === '/') {
      return {
        '/': rollup(values),
      };
    }

    if (key.lastIndexOf('/') === 0) {
      // Level 1
      const total = rollup(values);
      return {
        ...accum,
        [key]: total,
        '/': rollup([accum['/'], total]),
      };
    }

    // Level 2+ lastIndexOf should be >= 1 here.
    const total = rollup(values);
    let currentSlashIndex = 0;
    while (currentSlashIndex >= 0) {
      let outerKey = key.slice(0, currentSlashIndex);
      if (outerKey === '') {
        outerKey = '/';
      }
      const outerValue = accum[outerKey] ?? 0;
      accum = {
        ...accum,
        [outerKey]: rollup([outerValue, total]),
      };
      currentSlashIndex = key.indexOf('/', currentSlashIndex + 1);
    }
    return {
      ...accum,
      [key]: total,
    };
  }, {});
}

// TASK 1: Find total of all paths <= 100 000;
console.log('TASK 1');
const MAX_SIZE = 100_000;

function calculateBiggestSize(tree: DirTree) {
  const totals = calculateTreeSize(tree);
  const lessThanMax = Object.values(totals).filter((v) => v <= MAX_SIZE);
  return rollup(lessThanMax);
}

const totalLessThanMax = calculateBiggestSize(tree);
console.log({ totalLessThanMax });

// TASK 2:
console.log('TASK 2');
const TOTAL_SPACE = 70_000_000;
const MAX_FREE_SPACE = 30_000_000;

function findDirToDeleteSize(tree: DirTree) {
  const totals = calculateTreeSize(tree);
  console.log({ totals });
  const currentFreeSpace = TOTAL_SPACE - totals['/'];
  const freeSpaceNeeded = MAX_FREE_SPACE - currentFreeSpace;
  return Math.min(...Object.values(totals).filter((v) => v >= freeSpaceNeeded));
}

const dirToDeleteSize = findDirToDeleteSize(tree);
console.log({ dirToDeleteSize });
