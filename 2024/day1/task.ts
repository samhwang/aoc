import { parseInput } from '../src/parse-input';

function parseIntoList(input: string[]): [number[], number[]] {
  return input.reduce(
    ([leftList, rightList], line) => {
      if (line.trim().length === 0) {
        return [leftList, rightList];
      }

      const [left, right] = line.split('  ').map((char) => Number.parseInt(char, 10));
      leftList.push(left);
      rightList.push(right);
      return [leftList, rightList];
    },
    [[], []] as [number[], number[]]
  );
}

// PART 1: Calculate distance between ascending pairs

function part1(input: string[]) {
  const [leftList, rightList] = parseIntoList(input);
  leftList.sort((a, b) => a - b);
  rightList.sort((a, b) => a - b);

  let output = 0;
  for (let i = 0; i < leftList.length; i++) {
    output += Math.abs(leftList[i] - rightList[i]);
  }
  return output;
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
