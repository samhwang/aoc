const PriorityMap: Record<string, number> = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
  g: 7,
  h: 8,
  i: 9,
  j: 10,
  k: 11,
  l: 12,
  m: 13,
  n: 14,
  o: 15,
  p: 16,
  q: 17,
  r: 18,
  s: 19,
  t: 20,
  u: 21,
  v: 22,
  w: 23,
  x: 24,
  y: 25,
  z: 26,
  A: 27,
  B: 28,
  C: 29,
  D: 30,
  E: 31,
  F: 32,
  G: 33,
  H: 34,
  I: 35,
  J: 36,
  K: 37,
  L: 38,
  M: 39,
  N: 40,
  O: 41,
  P: 42,
  Q: 43,
  R: 44,
  S: 45,
  T: 46,
  U: 47,
  V: 48,
  W: 49,
  X: 50,
  Y: 51,
  Z: 52,
};

const rucksacks = Deno.readTextFileSync('./input.txt').split('\n');

// Task 1: Find duplicated items in each part of the rucksacks, calculate points.
console.log('TASK 1');
const halves = rucksacks.map((rs) => {
  const first = new Set(rs.substring(0, rs.length / 2));
  const last = new Set(rs.substring(rs.length / 2));
  return [first, last];
});

const priorityPoints = halves.reduce<number>((points, [first, last]) => {
  let total = 0;
  first.forEach((item) => {
    if (!last.has(item)) {
      return;
    }

    total += PriorityMap[item];
  });

  return points + total;
}, 0);
console.log({ priorityPoints });

// Task 2: Split into group of 3. Calculate points.
console.log('TASK 2');
const groups = rucksacks.reduce<Set<string>[][]>((accumulator, rs, currentIndex) => {
  if (currentIndex % 3 === 0) {
    accumulator.push([new Set(rs)]);
    return accumulator;
  }

  accumulator[accumulator.length - 1].push(new Set(rs));
  return accumulator;
}, []);

const badgePoints = groups.reduce((points, [elf1, elf2, elf3]) => {
  let badge = '';
  for (const item of elf1) {
    if (elf2.has(item) && elf3.has(item)) {
      badge = item;
      break;
    }
  }

  return points + PriorityMap[badge];
}, 0);
console.log({ badgePoints });
