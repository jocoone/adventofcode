function A(input) {
  return input
    .map((line) => [
      line.substring(0, line.length / 2),
      line.substring(line.length / 2),
    ])
    .map((compartments) => getIntersection(compartments[0], compartments[1]))
    .map(calculateItemValue)
    .reduce((prev, curr) => prev + curr, 0);
}

function B(input) {
  const intersections = [];
  for (let i = 0; i < input.length; i += 3) {
    intersections.push(getIntersection(input[i], input[i + 1], input[i + 2]));
  }
  return intersections
    .map(calculateItemValue)
    .reduce((prev, curr) => prev + curr, 0);
}

function parse(input) {
  return input;
}

function calculateItemValue(value) {
  return value.toUpperCase() === value
    ? value.charCodeAt(0) - 38
    : value.charCodeAt(0) - 96;
}

function getIntersection(value, ...others) {
  return value
    .split("")
    .filter((part) =>
      others
        .map((x) => x.includes(part))
        .reduce((prev, curr) => prev || curr, false)
    )[0];
}

module.exports = { A, B, parse };
