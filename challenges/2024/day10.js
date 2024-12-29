function A(input) {
  return calculateTrails(input, 9, -1, (coord, trailHeads) => {
    if (coord.value === 0) trailHeads.add(`${coord.y},${coord.x}`);
  });
}

function B(input) {
  return calculateTrails(input, 0, 1, (coord, trailHeads) => {
    if (coord.value === 9) trailHeads.add(trailHeads.size);
  });
}

function calculateTrails(input, start, offset, walkUpdate) {
  return input
    .flatMap((line, y) => line.split("")
      .map((cell, x) => ({ y, x, value: +cell }))
      .filter(({ value }) => value === start))
    .map(spot => findPath(input, spot, offset))
    .map(end => {
      const trailHeads = new Set();

      function walk(coord) {
        walkUpdate(coord, trailHeads);
        coord.paths.forEach(walk);
        return trailHeads.size;
      }

      return walk(end);
    })
    .reduce((acc, curr) => acc + curr, 0);
}

function findPath(map, coord, offset) {
  const { y, x, value } = coord;
  coord.paths = [];
  const newValue = value + offset;

  if (+map[y][x + 1] === newValue) coord.paths.push({ y, x: x + 1, value: newValue });
  if (+map[y][x - 1] === newValue) coord.paths.push({ y, x: x - 1, value: newValue });
  if (map[y + 1] && +map[y + 1][x] === newValue) coord.paths.push({ y: y + 1, x, value: newValue });
  if (map[y - 1] && +map[y - 1][x] === newValue) coord.paths.push({ y: y - 1, x, value: newValue });

  coord.paths.forEach(route => findPath(map, route, offset));

  return coord;
}

function parse(input) {
  return input;
}

module.exports = { A, B, parse };