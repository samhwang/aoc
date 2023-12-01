const instruction = Deno.readTextFileSync('./input.txt').split('\n').map<[Direction, number]>((line) => {
  const [dir, step] = line.split(' ');
  return [dir as Direction, Number.parseInt(step)];
});

interface Position {
  x: number;
  y: number;
}
const START_POSITION: Position = { x: 0, y: 0 };

type Direction = 'U' | 'D' | 'L' | 'R';

function moveKnot(position: Position, ...directions: Direction[]): Position {
  return directions.reduce<Position>(({ x, y }, dir) => {
    switch (dir) {
      case 'U':
        return { x, y: y + 1 };
      case 'D':
        return { x, y: y - 1 };
      case 'L':
        return { x: x - 1, y };
      case 'R':
        return { x: x + 1, y };
    }
  }, position);
}

function isAdjacent({ x: headX, y: headY }: Position, { x: tailX, y: tailY }: Position): boolean {
  return Math.abs(headX - tailX) <= 1 && Math.abs(headY - tailY) <= 1;
}

function moveTail(prevKnot: Position, currentKnot: Position): Position {
  if (isAdjacent(prevKnot, currentKnot)) {
    return currentKnot;
  }

  const xDistance = prevKnot.x - currentKnot.x;
  const yDistance = prevKnot.y - currentKnot.y;

  const moveSameRow = prevKnot.y === currentKnot.y;
  if (moveSameRow) {
    return moveKnot(currentKnot, xDistance > 0 ? 'R' : 'L');
  }

  const moveSameColumn = prevKnot.x === currentKnot.x;
  if (moveSameColumn) {
    return moveKnot(currentKnot, yDistance > 0 ? 'U' : 'D');
  }

  // Move diagonally
  return moveKnot(currentKnot, xDistance > 0 ? 'R' : 'L', yDistance > 0 ? 'U' : 'D');
}

function findUniqueTailPositions(tailPositions: Position[]) {
  return tailPositions.reduce<Position[]>((uniq, pos) => {
    if (uniq.find((p) => p.x === pos.x && p.y === pos.y)) {
      return uniq;
    }
    uniq.push(pos);
    return uniq;
  }, []);
}

function trackTailPositions(rope: Position[]) {
  const tailPositions = [START_POSITION];
  instruction.forEach(([dir, steps]) => {
    for (let step = 0; step < steps; step++) {
      rope[0] = moveKnot(rope[0], dir);
      for (let knot = 1; knot < rope.length; knot++) {
        rope[knot] = moveTail(rope[knot - 1], rope[knot]);
      }

      const tail = rope[rope.length - 1];
      if (!tailPositions.find((p) => p.x === tail.x && p.y === tail.y)) {
        tailPositions.push(tail);
      }
    }
  });

  return tailPositions;
}

function runTask(ropeLength: number) {
  const rope = Array(ropeLength).fill(START_POSITION);
  const tailPositions = trackTailPositions(rope);
  const uniqueTailPositions = findUniqueTailPositions(tailPositions);
  return uniqueTailPositions.length;
}

// Task 1: Find unique tail spots on the map, when there are 2 knots
const task1 = runTask(2);
console.log('TASK 1:', { task1 });

// Task 2: Same as above, but with 10 knots
const task2 = runTask(10);
console.log('TASK 2:', { task2 });
