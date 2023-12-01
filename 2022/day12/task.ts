type Location = [number, number];

type LoadData = {
  map: string[][];
  start: Location;
  end: Location;
};

const { map: MAP, start: START, end: END } = Deno.readTextFileSync('./input.txt')
  .split('\n')
  .reduce<LoadData>(
    ({ map, start, end }, line, rowNo) => {
      map.push(line.split(''));

      const indexOfS = line.indexOf('S');
      if (line.indexOf('S') > -1) {
        start = [rowNo, indexOfS];
      }

      const indexOfE = line.indexOf('E');
      if (line.indexOf('E') > -1) {
        end = [rowNo, indexOfE];
      }

      return {
        map,
        start,
        end,
      };
    },
    {
      map: [],
      start: [0, 0],
      end: [0, 0],
    },
  );

const MAX_COL = MAP[0].length;
const MAX_ROW = MAP.length;

function isTraversable(prev: string, next: string | undefined) {
  if (next === undefined) {
    return false;
  }

  if (prev === 'S') {
    prev = 'a';
  }

  if (next === 'S') {
    next = 'a';
  }

  if (next === 'E') {
    next = 'z';
  }

  return next.charCodeAt(0) < prev.charCodeAt(0) ||
    prev.charCodeAt(0) + 1 === next.charCodeAt(0) ||
    prev.charCodeAt(0) === next.charCodeAt(0);
}

function getChar(map: string[][], [row, col]: Location) {
  return map[row][col];
}

function getKey([row, col]: Location) {
  return `[${row},${col}]`;
}

function getNeighbors([row, col]: Location) {
  const left = [row, col - 1];
  const right = [row, col + 1];
  const up = [row - 1, col];
  const down = [row + 1, col];

  // Remove out of bounds
  return ([left, right, up, down] as Location[]).filter(([row, col]) =>
    !(row < 0 || col < 0 || row >= MAX_ROW || col >= MAX_COL)
  );
}

function calculatePath(map: string[][], start: Location, end: Location) {
  const points = [start];
  const stepsFrom = {
    [getKey(start)]: 0,
  };
  while (points.length > 0) {
    const currentPoint = points.shift()!;
    const currentValue = getChar(map, currentPoint);
    const steps = stepsFrom[getKey(currentPoint)];
    const neighbors = getNeighbors(currentPoint);

    for (const step of neighbors) {
      const key = getKey(step);
      if (Object.keys(stepsFrom).includes(key)) {
        continue;
      }
      const stepValue = getChar(map, step);
      if (!isTraversable(currentValue, stepValue)) {
        continue;
      }

      stepsFrom[getKey(step)] = steps + 1;
      points.push(step);

      if (stepValue === getChar(map, end)) {
        return steps + 1;
      }
    }
  }
}

console.log('START HERE');
const pathFromS = calculatePath(MAP, START, END)!;
console.log('Task 1: ', { pathFromS });

function findAllStartPoints(map: string[][]) {
  return map.reduce<Location[]>((allStarts, line, rowIndex) => {
    const allPoints = line.reduce<Location[]>((allPoints, char, colIndex) => {
      if (char !== 'a') {
        return allPoints;
      }

      allPoints.push([rowIndex, colIndex]);
      return allPoints;
    }, []);

    if (allPoints.length === 0) {
      return allStarts;
    }

    allStarts.push(...allPoints);
    return allStarts;
  }, []);
}

const allStarts = findAllStartPoints(MAP);
console.log({ allStarts });
let minPath = pathFromS;
allStarts.forEach((start) => {
  const path = calculatePath(MAP, start, END);
  console.log({ start, path });
  if (!path) {
    return;
  }

  minPath = Math.min(minPath, path);
});
console.log('Task 2: ', { minPath });
