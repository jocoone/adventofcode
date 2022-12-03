function A(input) {
  return input[input.length - 1];
}

function B(input) {
  return (
    input[input.length - 1] + input[input.length - 2] + input[input.length - 3]
  );
}

function parse(input) {
  let nums = [];

  let y = 0;
  for (let i of input) {
    if (i === "") {
      nums.push(y);
      y = 0;
    }
    y += Number(i);
  }
  return nums.sort((a, b) => a - b);
}

module.exports = { A, B, parse };
