const { min, max, sortBy } = require('lodash');

function A({ positions }) {
  const sortedPositions = sortBy(positions);
  const bestDistance =
    positions.length % 2 === 0
      ? sortedPositions[sortedPositions.length / 2]
      : sortedPositions[sortedPositions.length - 1 / 2];
  return positions
    .map((x) => x - bestDistance)
    .map(Math.abs)
    .reduce((prev, x) => prev + x, 0);
}

function B({ positions, smallest, highest }) {
  let result = 0;
  for (let i = smallest; i < highest + 1; i++) {
    const fuel = positions
      .map((x) => x - i)
      .map(Math.abs)
      .map(calculateFuel)
      .reduce((prev, x) => prev + x, 0);
    if (result === 0 || fuel < result) {
      result = fuel;
    }
  }
  return result;
}

function calculateFuel(step) {
  if (step === 1 || step === 0) {
    return step;
  }
  return step + calculateFuel(step - 1);
}

function parse(input) {
  const positions = input[0].split(',').map(Number);
  const smallest = min(positions);
  const highest = max(positions);
  return { positions, smallest, highest };
}

module.exports = { A, B, parse };
