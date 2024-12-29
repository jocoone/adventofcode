function A(input) {
  return input.filter(isSafe).length;
}

function B(input, resultA) {
  return resultA + input
    .filter(row => !isSafe(row))
    .filter(row => {
      for (let i = 0; i < row.length; i++) {
        const newRow = [...row];
        newRow.splice(i, 1);
        if (isSafe(newRow)) return true;
      }
    }).length;
}

function parse(input) {
  return input.map(row => row.split(" ").map(num => +num));
}

function isSafe(row) {
  const incDecRule = row.map((num, i) => num - (row[i + 1] || (num - 1))).slice(0, -1);
  const safeRule1 = incDecRule.every(num => num > 0) || incDecRule.every(num => num < 0);
  return safeRule1 && incDecRule.map(x => Math.abs(x)).every(num => num >= 1 && num <= 3);
}

module.exports = { A, B, parse };