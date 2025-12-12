import fs from 'node:fs';

type Present = {
  id: number;
  shape: string[][];
};

type Region = {
  sizeX: number;
  sizeY: number;
  quantities: number[];
};

type Config = {
  presents: Present[];
  regions: Region[];
};

function parseInput(inputPath: string): Config {
  const rawInput = fs.readFileSync(inputPath, { encoding: 'utf8' }).trim().split('\n\n');
  const presentGroups = rawInput.slice(0, rawInput.length - 1);
  const presents = presentGroups.reduce((accumulator, group) => {
    const [firstLine, ...lastLines] = group.split('\n');
    const indexMatcher = firstLine.match(/\d+/g);
    if (!indexMatcher) {
      throw new Error('Invalid input');
    }
    const index = Number.parseInt(indexMatcher[0], 10);

    const shapeGrid = lastLines.map((line) => line.split(''));

    accumulator.push({ id: index, shape: shapeGrid });
    return accumulator;
  }, [] as Present[]);
  const lastGroup = rawInput[rawInput.length - 1];
  const regions = lastGroup.split('\n').map((line) => {
    const sizeMatcher = line.match(/(\d+x\d+)/g);
    if (!sizeMatcher) {
      throw new Error('Invalid input');
    }
    const size = sizeMatcher[0].split('x').map((char) => Number.parseInt(char, 10));
    const quantities = line
      .slice(line.indexOf(':') + 1)
      .trim()
      .split(' ')
      .map((char) => Number.parseInt(char, 10));
    return { sizeX: size[0], sizeY: size[1], quantities };
  });

  return { presents, regions };
}

function canRegionFitAllPresents(presents: Present[], region: Region) {
  const regionArea = region.sizeX * region.sizeY;
  const totalPresentSize = presents.reduce((accumulator, present) => {
    const presentArea = present.shape.flat().filter((cell) => cell === '#').length;
    const totalPresentArea = presentArea * region.quantities[present.id];
    return accumulator + totalPresentArea;
  }, 0);
  return regionArea >= totalPresentSize;
}

function part1(input: Config) {
  return input.regions.filter((region) => canRegionFitAllPresents(input.presents, region)).length;
}

function part2(_input: string[]) {
  return 'THERE IS NO PART 2! MERRY XMAS!';
}

function go(): void {
  console.time('task');

  console.time('parse-input');
  const input = parseInput('./sample.txt');
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
