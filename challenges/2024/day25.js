function A({ keys, locks }) {
  let result = 0;
  for (const [key, lock] of generateCombinations(keys, locks)) {
    if (key.every((v, i) => (v + lock[i]) < 6)) {
      result++;
    }
  }
  return result;
}

function B({ keys, locks }) {


}

function *generateCombinations(keys, locks) {
  // Loop through each element in keys
  for (let i = 0; i < keys.length; i++) {
    // Loop through each element in locks
    for (let j = 0; j < locks.length; j++) {
      // Combine the elements and push to combinations array
      yield [keys[i], locks[j]];
    }
  }
}

function parse(input) {
  const locks = [];
  const keys = [];

  for (let i = 0; i < input.length; i+=8) {
    const schematic = input.slice(i, i + 7);
    const transposedSchematic = transpose(schematic);
    const schematicValues = [
      transposedSchematic[0].filter(v => v === '#').length - 1,
      transposedSchematic[1].filter(v => v === '#').length - 1,
      transposedSchematic[2].filter(v => v === '#').length - 1,
      transposedSchematic[3].filter(v => v === '#').length - 1,
      transposedSchematic[4].filter(v => v === '#').length - 1,
    ];
    if (input[i] === '#####') { // lock
      locks.push(schematicValues);
    } else { // key
      keys.push(schematicValues);
    }
  }

  return {keys, locks};
}

const transpose = (matrix) => {
  let [row] = matrix
  return row.split('').map((value, column) => matrix.map(row => row[column]))
}

module.exports = { A, B, parse };