function A(input) {
  const memory = [...input.map(x => [...x])];
  let i = memory.findLastIndex(x => x.length === 2);
  let leftIndexSpace = memory.findIndex(x => x.length === 1);
  do {
    memory.splice(leftIndexSpace, 0, [1, memory[i][1]]);
    memory[leftIndexSpace + 1][0]--;
    memory[i + 1][0]--;

    if (memory[i + 1][0] === 0) {
      memory.splice(i + 1, 1);
    }
    if (memory[memory.findIndex(x => x.length === 1)][0] === 0) memory.splice(leftIndexSpace + 1, 1);
    leftIndexSpace = memory.findIndex(x => x.length === 1);
    i = memory.findLastIndex(x => x.length === 2);
  } while (leftIndexSpace < i);
  return calculateChecksum(memory);
}

function B(input) {
  let memory = [...input.map(x => [...x])];
  let slotIndex = memory.findLastIndex(x => x.length === 2);
  let slot = memory[slotIndex];
  let freeSpaceIndex = memory.findIndex(x => x.length === 1 && x[0] >= slot[0]);
  do {
    if (freeSpaceIndex !== -1 && freeSpaceIndex < slotIndex) {
      const freeSpace = memory.splice(freeSpaceIndex, 1, slot)[0];
      memory[slotIndex] = [slot[0]];
      memory.splice(freeSpaceIndex + 1, 0, [freeSpace[0] - slot[0]]);
    }
    memory = memory.filter(([x]) => x > 0);
    for (let i = 0; i < memory.length - 1;) {
      if (memory[i].length === 1 && memory[i + 1].length === 1) {
        memory.splice(i, 2, [memory[i][0] + memory[i + 1][0]]);
      } else {
        i++;
      }
    }
    slotIndex = memory.findLastIndex(x => x.length === 2 && x[1] < slot[1]);
    if (slotIndex <= 0) break;
    slot = memory[slotIndex];
    freeSpaceIndex = memory.findIndex(x => x.length === 1 && x[0] >= slot[0]);
  } while (true);
  return calculateChecksum(memory);
}

function calculateChecksum(memory) {
  let index = 0;
  return memory.filter(([num]) => num > 0).flatMap(([num, x]) => {
    return new Array(num).fill("").map(() => (x || 0) * index++) }
  ).reduce((acc, x) => acc + x, 0);
}

function parse(input) {
  let index = 0;

  return input[0].split("").map(Number).map((num, i) => {
    if (i % 2 === 0) return [num, index++];
    else return [num];
  });
}

module.exports = { A, B, parse };