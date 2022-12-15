type X = number;
type Y = number;
type Coordinates = [X, Y];

function findBeaconSensorDistance(beacon: Coordinates, sensor: Coordinates) {
  const [x1, y1] = beacon;
  const [x2, y2] = sensor;
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function findCoordinatesFromDescription(desc: string): Coordinates {
  const startXIndex = desc.indexOf('x=');
  const commaIndex = desc.indexOf(',');
  const x = Number.parseInt(desc.substring(startXIndex + 2, commaIndex), 10);

  const startYIndex = desc.indexOf('y=');
  const y = Number.parseInt(desc.substring(startYIndex + 2), 10);

  return [x, y];
}

type MapData = {
  sensors: Coordinates[];
  beacons: Coordinates[];
  distances: number[];
};

function mapSensorAndBeacons(input: string): MapData {
  const lines = Deno.readTextFileSync(input).split('\n');
  const { sensors, beacons, distances } = lines.reduce<MapData>(
    ({ sensors, beacons, distances }, line) => {
      // Input has this format: Sensor at x=2, y=18: closest beacon is at x=-2, y=15
      const [sensor, beacon] = line.split(':').map((desc) => findCoordinatesFromDescription(desc));
      const distance = findBeaconSensorDistance(beacon, sensor);
      sensors.push(sensor);
      beacons.push(beacon);
      distances.push(distance);

      return { sensors, beacons, distances };
    },
    { sensors: [], beacons: [], distances: [] },
  );

  return { sensors, beacons, distances };
}

function pointBlocked(coordinates: Coordinates, things: Coordinates[]) {
  return things.find((t) => t[0] === coordinates[0] && t[1] === coordinates[1]);
}

function findPointsCoveredBySensor(sensor: Coordinates, distance: number): Coordinates[] {
  const [sensorX, sensorY] = sensor;
  const left = sensorX - distance;
  const right = sensorX + distance;

  const field: Coordinates[] = [];
  // Left to center
  for (let x = left; x < sensorX; x++) {
    for (let y = 0; y <= Math.abs(left - x); y++) {
      field.push([x, sensorY + y], [x, sensorY - y]);
    }
  }

  // Center
  for (let y = 1; y < distance + 1; y++) {
    field.push([sensorX, sensorY + y], [sensorX, sensorY - y]);
  }

  // Center to right
  for (let x = right; x > sensorX; x--) {
    for (let y = 0; y < Math.abs(x - right); y++) {
      field.push([x, sensorY + y], [x, sensorY - y]);
    }
  }

  return field;
}

function task1(input: string, depth: number) {
  const { sensors, beacons, distances } = mapSensorAndBeacons(input);
  const coveredBySensor = sensors
    .map((sensor, index) => findPointsCoveredBySensor(sensor, distances[index]))
    .flat() as Coordinates[];

  const filteredField: Coordinates[] = [];
  coveredBySensor.forEach((point) => {
    const exist = filteredField.find((p) => p[0] === point[0] && p[1] === point[1]);
    if (!exist) {
      filteredField.push(point);
    }
  });

  const fieldOnLine = filteredField.filter((point) => {
    return point[1] === depth && !pointBlocked(point, beacons) && !pointBlocked(point, sensors);
  }).sort((a, b) => {
    const x = a[0] - b[0];
    if (x === 0) {
      return a[1] - b[1];
    }

    return x;
  });

  const count = fieldOnLine.length;
  console.log({ fieldOnLine, count });
}
console.log('TASK 1');
task1('./input.txt', 2000000);
