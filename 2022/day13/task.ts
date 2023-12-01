type Item = number | Item[];

const PACKET_PAIRS = Deno.readTextFileSync('./input.txt').split('\n\n').map((pair) => {
  return pair.split('\n').map((item) => eval(item)) as Item[];
});

function compare(left: Item, right: Item) {
  if (typeof left === 'number' && typeof right === 'number') {
    if (left < right) {
      return true;
    } else if (left > right) {
      return false;
    } else {
      return undefined;
    }
  } else if (Array.isArray(left) && Array.isArray(right)) {
    for (let i = 0; i < Math.min(left.length, right.length); i++) {
      const isRightOrder = compare(left[i], right[i]);
      if (isRightOrder !== undefined) {
        return isRightOrder;
      }
    }

    if (left.length < right.length) {
      return true;
    }

    if (left.length > right.length) {
      return false;
    }
  } else {
    return compare(
      Array.isArray(left) ? left : [left],
      Array.isArray(right) ? right : [right],
    );
  }
}

function task1(packetPairs: Item[][]) {
  let sum = 0;
  for (let i = 0; i < packetPairs.length; i++) {
    const test = compare(...packetPairs[i]);
    sum = test ? sum + i + 1 : sum;
  }
  return sum;
}
console.log('Task 1: ', task1(PACKET_PAIRS));

function task2(packetPairs: Item[][]) {
  const divider1: Item[] = [[2]];
  const divider2: Item[] = [[6]];
  const packets = [
    divider1,
    divider2,
    ...packetPairs.flat(),
  ].sort((left, right) => {
    const test = compare(left, right);
    if (test === undefined) {
      return 0;
    }

    return test ? -1 : 1;
  });

  const indexDiv1 = packets.indexOf(divider1) + 1;
  const indexDiv2 = packets.indexOf(divider2) + 1;
  return indexDiv1 * indexDiv2;
}
console.log('Task 2: ', task2(PACKET_PAIRS));
