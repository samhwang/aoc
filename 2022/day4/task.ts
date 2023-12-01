const lines = Deno.readTextFileSync('./input.txt').split('\n');

type ElfTask = [number, number];

function splitElfTask(id: string): ElfTask {
  return id.split('-').map((task) => Number.parseInt(task)) as ElfTask;
}

const pairs = lines.reduce<[ElfTask, ElfTask][]>((accumulator, line) => {
  const [elf1, elf2] = line.split(',');
  accumulator.push([splitElfTask(elf1), splitElfTask(elf2)]);
  return accumulator;
}, []);

// TASK 1: Find all consumed task pairs (i.e. 1 is completely overlapped by the other)
function findConsumed(elf1: ElfTask, elf2: ElfTask) {
  const firstConsumeLast = elf1[0] <= elf2[0] && elf1[1] >= elf2[1];
  const lastConsumeFirst = elf2[0] <= elf1[0] && elf2[1] >= elf1[1];
  return firstConsumeLast || lastConsumeFirst;
}

console.log('TASK 1');
const consumed = pairs.reduce((count, [elf1, elf2]) => {
  return findConsumed(elf1, elf2) ? count + 1 : count;
}, 0);
console.log({ consumed });

// TASK 2: Find all overlapped pairs
function findOverlap(elf1: ElfTask, elf2: ElfTask) {
  return !(elf1[1] < elf2[0] || elf1[0] > elf2[1]);
}

console.log('TASK 2');
const overlap = pairs.reduce((count, [elf1, elf2]) => {
  return findOverlap(elf1, elf2) ? count + 1 : count;
}, 0);
console.log({ overlap });
