type X = number;
type Y = number;
type Coordinates = [X, Y];

function calculateManhattanDistance(beacon: Coordinates, sensor: Coordinates) {
  const [x1, y1] = beacon;
  const [x2, y2] = sensor;
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function findCoordinatesFromDescription(desc: string): Coordinates {
  // Input format: Sensor at x=2, y=18: closest beacon is at x=-2, y=15
  const startXIndex = desc.indexOf('x=');
  const commaIndex = desc.indexOf(',');
  const x = Number.parseInt(desc.substring(startXIndex + 2, commaIndex), 10);

  const startYIndex = desc.indexOf('y=');
  const y = Number.parseInt(desc.substring(startYIndex + 2), 10);

  return [x, y];
}

type Pair = {
  sensor: Coordinates;
  beacon: Coordinates;
  distance: number;
};

function mapSensorAndBeacons(input: string): Pair[] {
  const lines = Deno.readTextFileSync(input).split('\n');
  return lines.reduce<Pair[]>(
    (accumulator, line) => {
      const [sensor, beacon] = line.split(':').map((desc) => findCoordinatesFromDescription(desc));
      const distance = calculateManhattanDistance(beacon, sensor);
      accumulator.push({ sensor, beacon, distance });
      return accumulator;
    },
    [],
  );
}

function isCoveredBySensor(point: Coordinates, sensor: Pair['sensor'], distance: Pair['distance']) {
  const distanceToPoint = calculateManhattanDistance(point, sensor);
  return distanceToPoint <= distance;
}

function detectPoint(point: Coordinates, mapData: Pair[]) {
  const [x, y] = point;
  const sensorsCoveringPoint = mapData.filter(({ sensor, distance }) => {
    return isCoveredBySensor(point, sensor, distance);
  });
  const inRange = sensorsCoveringPoint.length > 0;

  let newX = x;
  if (inRange) {
    const allXReach = sensorsCoveringPoint
      .map(({ sensor, distance }) => {
        return getSensorXReach(y, sensor, distance);
      })
      .flat();
    newX = Math.max(...allXReach);
  }

  return { inRange, newX };
}

function getSensorXReach(y: number, [sensorX, sensorY]: Pair['sensor'], distance: Pair['distance']) {
  const deltaX = distance - Math.abs(sensorY - y);
  return [sensorX - deltaX, sensorX + deltaX];
}

function getSensorXBoundary(y: number, mapData: Pair[]) {
  const allX = mapData
    .filter(({ sensor, distance }) => {
      const [x1] = getSensorXReach(y, sensor, distance);
      const distanceToPoint = calculateManhattanDistance(sensor, [x1, y]);
      return distanceToPoint <= distance;
    })
    .map(({ sensor, distance }) => getSensorXReach(y, sensor, distance))
    .flat();
  return [Math.min(...allX), Math.max(...allX)];
}

// Task 1: Find how many position cannot contain a beacon in a specific depth of the map.
function findNonBeaconsPositionsInLine(input: string, y: number) {
  const map = mapSensorAndBeacons(input);

  let [left, right] = getSensorXBoundary(y, map);
  const minX = Number.NEGATIVE_INFINITY;
  const maxX = Number.POSITIVE_INFINITY;
  left = Math.max(left, minX);
  right = Math.min(right, maxX);

  let count = 0;
  for (let x = left; x <= right; x++) {
    const { inRange, newX } = detectPoint([x, y], map);
    if (inRange) {
      const r = Math.min(newX, right);
      count = count + r - x + 1;
      x = r;
    }
  }

  const beaconsOnLine = map.reduce<Coordinates[]>((accum, { beacon }) => {
    const [beaconX, beaconY] = beacon;
    const beaconOnLine = beaconY === y && beaconX >= left && beaconX <= right;
    const notInAccum = accum.find(([x, y]) => x === beaconX && y === beaconY) === undefined;
    if (beaconOnLine && notInAccum) {
      accum.push(beacon);
    }
    return accum;
  }, []);

  const diff = count - beaconsOnLine.length;
  return { diff, count };
}
console.log('TASK 1');
const { diff, count } = findNonBeaconsPositionsInLine('./input.txt', 2000000);
// const { diff, count } = findNonBeaconsPositionsInLine('./input2.txt', 10);
console.log({ diff, count });
