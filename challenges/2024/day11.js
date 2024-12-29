const { memoize } = require("lodash");

function A(stones) {
  return blink(stones, 25);
}

function B(stones) {
  return blink(stones, 75);
}

const blink = memoize((stones, iterations) => {
  return iterations === 0 ? 1 : stones
    .flatMap(mapStone)
    .map(s => blink([s], iterations - 1))
    .reduce((acc, curr) => acc + curr, 0);
}, (stones, iterations) => `${stones[0]}-${iterations}`);

function mapStone(stone) {
  const stoneString = `${stone}`;
  if (stone === 0) return [1];
  else if (stoneString.length % 2 === 0) return [+stoneString.slice(0, stoneString.length / 2), +stoneString.slice(stoneString.length / 2).replace(/^0*/, "0")];
  else return [stone * 2024];
}

function parse(input) {
  return input[0].split(" ").map(Number);
}

module.exports = { A, B, parse };