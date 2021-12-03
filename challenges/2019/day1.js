function determineFuel(input) {
  return Math.floor(input / 3) - 2;
}

function calculateFuel(lines, operator = (x) => x) {
  return lines
    .map(determineFuel)
    .map(operator)
    .reduce((x, y) => x + y);
}

function calculateAdditionalFuel(fuel) {
  const additionalFuel = determineFuel(fuel);
  if (additionalFuel < 0) {
    return fuel;
  }
  return calculateAdditionalFuel(additionalFuel) + fuel;
}

function A(input) {
  return calculateFuel(input);
}

function B(input) {
  return calculateFuel(input, calculateAdditionalFuel);
}

function parse(input) {
  return input.map(Number);
}

module.exports = { A, B, parse };
