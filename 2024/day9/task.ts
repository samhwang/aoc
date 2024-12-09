import { parseInput } from '../src/parse-input';

function parseDisk(input): string {

}

function part1(input: string) {}

function part2(input: string) {}

function go(): void {
  console.time('task');

  console.time('parse-input');
  const input = parseInput('./sample.txt')[0];
  console.log({ input })
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
