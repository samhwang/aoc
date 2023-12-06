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

  mapInput.sort((a, b) => a.source - b.source);
  return mapInput;
}

function findFromMap1(map: MapInput[], needle: number): number {
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
    const soil = findFromMap1(seedSoilMap, seed);
    const fertiizer = findFromMap1(soilFertilizerMap, soil);
    const water = findFromMap1(fertiizerWaterMap, fertiizer);
    const light = findFromMap1(waterLightMap, water);
    const temperature = findFromMap1(lightTemperatureMap, light);
    const humidity = findFromMap1(temperatureHumidityMap, temperature);
    const location = findFromMap1(humidityLocationMap, humidity);

    return location;
  });

  return Math.min(...locations);
}

type SeedInput = { start: number; range: number };

function createSeedInput(seedLine: string): SeedInput[] {
  const seedInput: SeedInput[] = [];
  const split = seedLine.substring(seedLine.indexOf(':') + 2).split(' ');
  for (let i = 0; i < split.length; i = i + 2) {
    const start = Number.parseInt(split[i].trim(), 10);
    const range = Number.parseInt(split[i + 1].trim(), 10);
    seedInput.push({ start, range });
  }

  seedInput.sort((a, b) => a.start - b.start);
  return seedInput;
}

function findSetFromMap(map: MapInput[], inputSet: SeedInput[]): number[] {
  const resultSet: number[] = [];

  return resultSet;
}

function part2(input: string[]) {
  const seedLine = input[0];
  const seedInput = createSeedInput(seedLine);

  const [seedSoilMap, soilFertilizerMap, fertiizerWaterMap, waterLightMap, lightTemperatureMap, temperatureHumidityMap, humidityLocationMap] = [
    'seed-to-soil map:',
    'soil-to-fertilizer map:',
    'fertilizer-to-water map:',
    'water-to-light map:',
    'light-to-temperature map:',
    'temperature-to-humidity map:',
    'humidity-to-location map:',
  ].map((mapName) => createMapInput(input, mapName));

  const locations = [];
  // const locations = seeds.map((seed) => {
  //   const soil = findFromMap1(seedSoilMap, seed);
  //   const fertiizer = findFromMap1(soilFertilizerMap, soil);
  //   const water = findFromMap1(fertiizerWaterMap, fertiizer);
  //   const light = findFromMap1(waterLightMap, water);
  //   const temperature = findFromMap1(lightTemperatureMap, light);
  //   const humidity = findFromMap1(temperatureHumidityMap, temperature);
  //   const location = findFromMap1(humidityLocationMap, humidity);

  //   return location;
  // });

  return Math.min(...locations);
}

function go() {
  const input = parseInput('./input.txt');

  const res1 = part1(input);
  console.log('PART 1: ', res1);

  const res2 = part2(input);
  console.log('PART 2: ', res2);
}

go();
