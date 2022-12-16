const TIME_LIMIT_MINUTES = 30;

class Valve {
  public readonly to: Record<Valve['name'], number>;

  constructor(
    public readonly name: string,
    public readonly flowRate: number,
    leadTo: Valve['name'][],
    public open: boolean = false,
  ) {
    this.to = leadTo.reduce<Valve['to']>((to, name) => {
      to[name] = 1;
      return to;
    }, {});
  }

  static parseLine(line: string) {
    // Input format: Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
    const match = line.match(
      /^Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z, ]+)$/,
    )!;
    const [_, name, flowRate, leadTo] = match;
    return new Valve(name, Number.parseInt(flowRate, 10), leadTo.split(', '));
  }
}

function getValve(map: Valve[], name: string) {
  return map.find((v) => v.name === name);
}

function createValveMap(input: string) {
  return Deno.readTextFileSync(input)
    .split('\n')
    .reduce<Valve[]>((valves, line) => {
      const valve = Valve.parseLine(line);
      valves.push(valve);
      return valves;
    }, []);
}

function findValvesToOpen(map: Valve[]) {
  return map.reduce<Valve[]>((toOpen, valve) => {
    return valve.flowRate <= 0 ? toOpen : [...toOpen, valve];
  }, []);
}

function findPath(start: string, map: Valve[]): Record<Valve['name'], number> {
  const startValve = getValve(map, start)!;
  const visited: Record<Valve['name'], number> = {};
  const unvisited: [Valve, number][] = [[startValve, 0]];
  while (unvisited.length > 0) {
    const [next, steps] = unvisited.shift()!;
    if (!(next.name in visited)) {
      visited[next.name] = steps;
    } else if (steps >= visited[next.name]) {
      continue;
    } else {
      visited[next.name] = steps;
    }

    Object.keys(next.to).forEach((name) => {
      const currentValve = getValve(map, name)!;
      unvisited.push([currentValve, steps + next.to[name]]);
    });
  }

  delete visited[start];
  return visited;
}

function calculatePathToValves(map: Valve[], valvesToOpen: Valve[]) {
  return valvesToOpen.reduce<Record<Valve['name'], Record<Valve['name'], number>>>(
    (accumulator, valve) => {
      accumulator[valve.name] = findPath(valve.name, map);
      return accumulator;
    },
    {
      AA: findPath('AA', map),
    },
  );
}

function calculatePressure(map: Valve[]) {
  return map.reduce<number>((pressure, valve) => {
    return valve.open ? pressure + valve.flowRate : pressure;
  }, 0);
}

// Task 1: Find the most pressure can be release
function task1(input: string, timeLimit: number) {
  const valves = createValveMap(input);
  const valvesToOpen = findValvesToOpen(valves);
  const paths = calculatePathToValves(valves, valvesToOpen);
  console.log({ valves, valvesToOpen, paths });

  let currentPressure = 0;
  let visited = ['AA'];
  let minute = timeLimit;
  while (minute > 0) {
    minute--;
  }

  return currentPressure;
}
// const result = task1('./input.txt', TIME_LIMIT_MINUTES);
const result = task1('./input2.txt', TIME_LIMIT_MINUTES);
console.log({ result });
