import { parseInput } from '../src/parse-input';

type MapInput = { destination: number; source: number; range: number };
function createMap(input: MapInput[]): Record<number, number> {
  const map: Record<number, number> = {};
  for (const { destination, source, range } of input) {
    for (let i = 0; i < range; i++) {
      map[source + i] = destination + i;
    }
  }

  return map;
}

function createMapInput(map: string[], mapName: string) {
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
  ].map((mapName) => {
    const start = input.findIndex((line) => line === mapName);
    const mapInput: MapInput[] = [];
    for (let i = start + 1; i < input.length; i++) {
      const line = input[i];
      if (line === '') {
        break;
      }
      const [destination, source, range] = line.split(' ').map((s) => Number.parseInt(s.trim(), 10));
      mapInput.push({ destination, source, range });
    }
    const map = createMap(mapInput);
    return map;
  });

  const locations = seeds.map((seed) => {
    const soil = seed in seedSoilMap ? seedSoilMap[seed] : seed;
    const fertilizer = soil in soilFertilizerMap ? soilFertilizerMap[soil] : soil;
    const water = fertilizer in fertiizerWaterMap ? fertiizerWaterMap[fertilizer] : fertilizer;
    const light = water in waterLightMap ? waterLightMap[water] : water;
    const temperature = light in lightTemperatureMap ? lightTemperatureMap[light] : light;
    const humidity = temperature in temperatureHumidityMap ? temperatureHumidityMap[temperature] : temperature;
    const location = humidity in humidityLocationMap ? humidityLocationMap[humidity] : humidity;

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
