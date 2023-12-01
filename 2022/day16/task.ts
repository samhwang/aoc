const TIME_LIMIT_MINUTES = 30;

class Valve {
  public to: Record<Valve['name'], number>;

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

type PathMap = Record<Valve['name'], Record<Valve['name'], number>>;
function calculatePathToValves(map: Valve[]) {
  return map.reduce<PathMap>(
    (accumulator, valve) => {
      accumulator[valve.name] = findPath(valve.name, map);
      return accumulator;
    },
    {
      AA: findPath('AA', map),
    },
  );
}

function addPathToMap(map: Valve[], paths: PathMap) {
  return map.map((valve) => {
    valve.to = {
      ...valve.to,
      ...paths[valve.name],
    }
  });
}

function openValve(map: Valve[], name: Valve['name']) {
  return map.reduce<Valve[]>((accum, valve) => {
    if (valve.name !== name) {
      accum.push(valve);
      return accum;
    }

    valve.open = true;
    accum.push(valve);
    return accum;
  }, []);
}

function calculatePressure(map: Valve[]) {
  return map.reduce<number>((pressure, valve) => {
    return valve.open ? pressure + valve.flowRate : pressure;
  }, 0);
}

// Task 1: Find the most pressure can be release
function task1(input: string, timeLimit: number) {
  const valves = createValveMap(input);
  const paths = calculatePathToValves(valves);
  addPathToMap(valves, paths);
  console.log({
    valves: valves.map((v) => ({ name: v.name, to: v.to, flowRate: v.flowRate })),
    paths,
  });

  const filteredValves = valves.filter((v) => v.flowRate > 0);
  let currentPressure = 0;
  let currentPoint = 'AA';
  let timeRemaining = timeLimit;
  while (timeRemaining > 0) {
    console.log('-----------------------------------------------');
    console.log('TIME REMAINING: ', timeRemaining);
    const priorities = filteredValves
      .filter((v) => !v.open)
      .sort((a, b) => {
        const sortByDistance = paths[currentPoint][a.name] - paths[currentPoint][b.name];
        if (sortByDistance === 0) {
          return b.flowRate - a.flowRate;
        }

        return sortByDistance;
      });

    if (priorities.length <= 0) {
      console.log({
        currentPoint,
        priorities: priorities.map((v) => ({ name: v.name, flowRate: v.flowRate })),
        toOpen: undefined,
        currentPressure
      });
      const addPressure = calculatePressure(valves) * timeRemaining;
      currentPressure = currentPressure + addPressure;
      console.log({ minuteToPass: timeRemaining, addPressure, currentPressure });
      timeRemaining = 0;
      continue;
    }

    const toOpen = priorities[0];
    console.log({
      currentPoint,
      priorities: priorities.map((v) => {
        return {
          name: v.name,
          flowRate: v.flowRate,
          distanceFromCurrent: paths[currentPoint][v.name],
        }
      }),
      toOpen: {
        name: toOpen.name,
        flowRate: toOpen.flowRate,
        distanceFromCurrent: paths[currentPoint][toOpen.name],
      },
      currentPressure
    });
    const travelTime = paths[currentPoint][toOpen.name];
    const pressureBeforeOpenValve = calculatePressure(filteredValves) * travelTime;
    openValve(filteredValves, toOpen.name);
    const addPressure = pressureBeforeOpenValve + calculatePressure(filteredValves);
    currentPressure = currentPressure + addPressure;
    const minuteToPass = paths[currentPoint][toOpen.name] + 1;
    timeRemaining = timeRemaining - minuteToPass;
    currentPoint = toOpen.name;
    console.log({ minuteToPass, addPressure, currentPressure });
  }

  return currentPressure;
}
// const result = task1('./input.txt', TIME_LIMIT_MINUTES);
const result = task1('./input2.txt', TIME_LIMIT_MINUTES);
console.log({ result });
