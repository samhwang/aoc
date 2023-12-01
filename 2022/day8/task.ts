const treeMap = Deno.readTextFileSync('./input.txt').split('\n').reduce<number[][]>((map, line) => {
  return [...map, line.split('').map((tree) => Number.parseInt(tree))];
}, []);

// Task 1: Find all visible trees in the map
function checkTreeVisibilityFromEdge(row: number, col: number) {
  const currentTree = treeMap[row][col];

  let visibleFromTopEdge = true;
  for (let u = row - 1; u >= 0; u--) {
    visibleFromTopEdge = treeMap[u][col] < currentTree;
    if (!visibleFromTopEdge) {
      break;
    }
  }
  if (visibleFromTopEdge) {
    return true;
  }

  let visibleFromLeftEdge = true;
  for (let l = col - 1; l >= 0; l--) {
    visibleFromLeftEdge = treeMap[row][l] < currentTree;
    if (!visibleFromLeftEdge) {
      break;
    }
  }
  if (visibleFromLeftEdge) {
    return true;
  }

  let visibleFromRightEdge = true;
  for (let r = col + 1; r < treeMap[row].length; r++) {
    visibleFromRightEdge = treeMap[row][r] < currentTree;
    if (!visibleFromRightEdge) {
      break;
    }
  }
  if (visibleFromRightEdge) {
    return true;
  }

  let visibleFromBottomEdge = true;
  for (let d = row + 1; d < treeMap.length; d++) {
    visibleFromBottomEdge = treeMap[d][col] < currentTree;
    if (!visibleFromBottomEdge) {
      break;
    }
  }
  if (visibleFromBottomEdge) {
    return true;
  }

  return false;
}

let totalVisibleTrees = 2 * treeMap[0].length + 2 * (treeMap.length - 2); // All edge trees;
for (let row = 1; row < treeMap.length - 1; row++) {
  for (let col = 1; col < treeMap[row].length - 1; col++) {
    const visible = checkTreeVisibilityFromEdge(row, col);
    if (visible) {
      totalVisibleTrees += 1;
    }
  }
}
console.log({ totalVisibleTrees });

function calculateVisibility(row: number, col: number) {
  const currentTree = treeMap[row][col];

  let viewToTopEdge = 0;
  for (let u = row - 1; u >= 0; u--) {
    viewToTopEdge += 1;
    if (treeMap[u][col] >= currentTree) {
      break;
    }
  }

  let viewToLeftEdge = 0;
  for (let l = col - 1; l >= 0; l--) {
    viewToLeftEdge += 1;
    if (treeMap[row][l] >= currentTree) {
      break;
    }
  }

  let viewToRightEdge = 0;
  for (let r = col + 1; r < treeMap[row].length; r++) {
    viewToRightEdge += 1;
    if (treeMap[row][r] >= currentTree) {
      break;
    }
  }

  let viewToBottomEdge = 0;
  for (let d = row + 1; d < treeMap.length; d++) {
    viewToBottomEdge += 1;
    if (treeMap[d][col] >= currentTree) {
      break;
    }
  }

  const visibility = viewToTopEdge * viewToBottomEdge * viewToLeftEdge * viewToRightEdge;
  return visibility;
}

let highestVisibility = 1;
for (let row = 1; row < treeMap.length - 1; row++) {
  for (let col = 1; col < treeMap[row].length - 1; col++) {
    const visibility = calculateVisibility(row, col);
    highestVisibility = Math.max(visibility, highestVisibility);
  }
}
console.log({ highestVisibility });
