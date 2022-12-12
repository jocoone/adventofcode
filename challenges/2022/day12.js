const { findShortestRoute } = require("../../common/utils");

function A({ map, start, destination }) {
  return findPath(map, start, destination);
}

function B({ map, destination }) {
  return map
    .map((row, y) =>
      row.map((el, x) => (el === "a".charCodeAt(0) ? { x, y } : null))
    )
    .flat()
    .filter((el) => !!el)
    .map((s) => findPath(map, s, destination))
    .filter((x) => x > 0)
    .reduce(
      (prev, curr) => (curr < prev ? curr : prev),
      Number.MAX_SAFE_INTEGER
    );
}

function findPath(grid, position, end) {
  return (
    findShortestRoute(
      grid,
      position,
      end,
      (moveTo, currPos) =>
        grid[moveTo.y][moveTo.x] <= grid[currPos.y][currPos.x] + 1
    ).length - 1
  ); // starting point is part of pathway
}

function getLocation(input, c) {
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === c.charCodeAt(0)) return { x, y };
    }
  }
}

function parse(input) {
  const map = input.map((l) => l.split("").map((x) => x.charCodeAt(0)));
  const start = getLocation(map, "S");
  const destination = getLocation(map, "E");
  map[start.y][start.x] = "a".charCodeAt(0);
  map[destination.y][destination.x] = "z".charCodeAt(0);

  return { map, start, destination };
}

module.exports = { A, B, parse };
