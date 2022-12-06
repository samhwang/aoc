const message = Deno.readTextFileSync('./input.txt');

function findMarkerPoint(size: number) {
  let i: number;
  for (i = size; i < message.length; i++) {
    const sub = message.substring(i - size, i);
    const markers = new Set<string>(sub);
    if (markers.size === size) {
      break;
    }
  }
  return i;
}

// TASK 1: Find the first position where the last 4 characters are all unique.
const HEADER_SIZE = 4;
const headerPoint = findMarkerPoint(HEADER_SIZE);
console.log({ markerPoint: headerPoint });

// TASK 2: Find the first position where the last 14 characters are all unique
const MESSAGE_SIZE = 14;
const messagePoint = findMarkerPoint(MESSAGE_SIZE);
console.log({ messagePoint });
