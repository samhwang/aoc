import { parseInput } from '../src/parse-input';

type MapInput = { destination: number; source: number; range: number };

function createMapInput(map: string[], mapName: string): MapInput[] {
  const start = map.findIndex((line) => line === mapName);
  const mapInput: MapInput[] = [];
  for (let i = start + 1; i < map.length; i++) {
    const line = map[i];
    if (line === '') {
      break;
    }
    const [destination, source, range] = line.split(' ').map((s) => Number.parseInt(s.trim(), 10));
    mapInput.push({ destination, source, range });
  }

  return mapInput;
}

function findFromMap(map: MapInput[], needle: number): number {
  const record = map.find(({ source, range }) => source <= needle && needle <= source + range);
  if (!record) {
    return needle;
  }

  const { destination, source } = record;
  return destination + (needle - source);
}

function part1(input: string[]) {
  const seedLine = input[0];
  const seeds = seedLine
    .substring(seedLine.indexOf(':') + 2)
    .split(' ')
    .map((s) => Number.parseInt(s.trim()));

  const [seedSoilMap, soilFertilizerMap, fertiizerWaterMap, waterLightMap, lightTemperatureMap, temperatureHumidityMap, humidityLocationMap] = [
    'seed-to-soil map:',
    'soil-to-fertilizer map:',
    'fertilizer-to-water map:',
    'water-to-light map:',
    'light-to-temperature map:',
    'temperature-to-humidity map:',
    'humidity-to-location map:',
  ].map((mapName) => createMapInput(input, mapName));

  const locations = seeds.map((seed) => {
    const soil = findFromMap(seedSoilMap, seed);
    const fertiizer = findFromMap(soilFertilizerMap, soil);
    const water = findFromMap(fertiizerWaterMap, fertiizer);
    const light = findFromMap(waterLightMap, water);
    const temperature = findFromMap(lightTemperatureMap, light);
    const humidity = findFromMap(temperatureHumidityMap, temperature);
    const location = findFromMap(humidityLocationMap, humidity);

    return location;
  });

  return Math.min(...locations);
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
