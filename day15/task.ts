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
}

function mapSensorAndBeacons(input: string) {
  const lines = Deno.readTextFileSync(input).split('\n');
  const { sensors, beacons } = lines.reduce<MapData>(
    ({ sensors, beacons }, line) => {
      // Input has this format: Sensor at x=2, y=18: closest beacon is at x=-2, y=15
      const [sensor, beacon] = line.split(':').map((desc) => findCoordinatesFromDescription(desc));
      sensors.push(sensor);
      beacons.push(beacon);

      return { sensors, beacons };
    },
    { sensors: [], beacons: [] }
  );

  const distance = findBeaconSensorDistance(sensors[0], beacons[0]);

  return { sensors, beacons, distance };
}

const { sensors, beacons, distance } = mapSensorAndBeacons('./input2.txt');
console.log({ sensors, beacons, distance });
