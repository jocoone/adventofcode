function A(input) {
  let count = 0;

  for (let i = 1; i < input.length; i++) {
    if (input[i] > input[i - 1]) {
      count++;
    }
  }
  return count;
}

function B(input) {
  let count = 0;
  let lastSum = 0;

  for (let i = 0; i < input.length - 2; i++) {
    const sum = input[i] + input[i + 1] + input[i + 2];
    if (sum > lastSum) {
      count++;
    }
    lastSum = sum;
  }
  return count - 1; // first comparison doesnt count
}

function parse(input) {
  return input.map(Number);
}

module.exports = { A, B, parse };
