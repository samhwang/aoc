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

function findConsumed(elf1: ElfTask, elf2: ElfTask) {
  const firstConsumeLast = elf1[0] <= elf2[0] && elf1[1] >= elf2[1];
  const lastConsumeFirst = elf2[0] <= elf1[0] && elf2[1] >= elf1[1];
  const overlap = firstConsumeLast || lastConsumeFirst;
  return overlap;
}

// TASK 1: Find all consumed task pairs (i.e. 1 is completely overlapped by the other)
console.log('RUNNING TASK 1');
const consumed = pairs.reduce((count, [elf1, elf2]) => {
  const consumed = findConsumed(elf1, elf2);
  return consumed ? count + 1 : count;
}, 0);
console.log({ consumed });

function findOverlap(elf1: ElfTask, elf2: ElfTask) {
  if (findConsumed(elf1, elf2)) {
    return true;
  }

  if (elf1[1] < elf2[0]) {
    return false;
  }

  if (elf1[0] > elf2[1]) {
    return false;
  }

  return true;
}

// TASK 2: Find all overlapped pairs
console.log('RUNNING TASK 2');
const overlap = pairs.reduce((count, [elf1, elf2]) => {
  const overlap = findOverlap(elf1, elf2);
  return overlap ? count + 1 : count;
}, 0);
console.log({ overlap });
