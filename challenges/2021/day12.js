const { flattenDeep, flattenDepth } = require("lodash");

function A(input) {
  return calculatePaths(input["start"], input, true);
}

function B(input) {
  return calculatePaths(input["start"], input);
}

function calculatePaths(
  cave,
  paths,
  smallCavesReached = false,
  route = [],
  visited = new Set()
) {
  let possiblePaths = 0;
  const newRoute = [...route];

  if (visited.has(cave.id)) {
    if (smallCavesReached || cave.id === "start" || cave.id === "end") {
      return possiblePaths;
    } else smallCavesReached = true;
  } else if (!cave.isLargeCave) {
    visited.add(cave.id);
  }

  newRoute.push(cave.id);

  Array.from(cave.connections).forEach((connection) => {
    if (connection === "end") possiblePaths += 1;
    else
      possiblePaths += calculatePaths(
        paths[connection],
        paths,
        smallCavesReached,
        newRoute,
        new Set(Array.from(visited))
      );
  });

  return possiblePaths;
}

function createPath(a, b, paths) {
  const path =
    a in paths
      ? paths[a]
      : {
          connections: new Set(),
          isLargeCave: /[A-Z]/.test(a),
          id: a,
          visits: 0,
        };
  path.connections.add(b);
  return path;
}

function parse(input) {
  return input
    .map((line) => line.split("-"))
    .reduce((prev, [a, b]) => {
      return {
        ...prev,
        [a]: createPath(a, b, prev),
        [b]: createPath(b, a, prev),
      };
    }, {});
}

module.exports = { A, B, parse };
