const { uniqBy } = require("lodash");

function A(map) {
  return calculateAntiNodes(map).length;
}

function B(map) {
  return calculateAntiNodes(map, true).length;
}

function getAntennas(map) {
  return map
    .flatMap((row, y) => row
      .map((spot, x) => [spot, x, y])
      .filter(([spot]) => spot !== "."));
}

function createAntennaPairs(antennas) {
  const pairs = [];
  for (const [s1, x1, y1] of antennas) {
    for (const [s2, x2, y2] of antennas) {
      if (s1 === s2 && x1 !== x2 && y1 !== y2
        && !pairs.find(([[a1x, a1y], [a2x, a2y]]) => `${a1x},${a1y}` === `${x2},${y2}` && `${a2x},${a2y}` === `${x1},${y1}`)) {
        pairs.push([[x1, y1], [x2, y2]]);
      }
    }
  }
  return pairs;
}

function calculateAntiNodes(map, beam) {
  const antennas = getAntennas(map);
  const pairs = createAntennaPairs(antennas);
  return uniqBy(pairs
    .flatMap(([[a1x, a1y], [a2x, a2y]]) => {
      const xDiff = Math.abs(a1x - a2x);
      const yDiff = Math.abs(a1y - a2y);
      const rico = (a2y - a1y) / (a2x - a1x);
      const antiNodes = [
        [Math.max(a1x, a2x) + xDiff, calculateY(rico, a1y, a2y, yDiff)],
        [Math.min(a1x, a2x) - xDiff, calculateY(-rico, a1y, a2y, yDiff)],
      ];
      let i = 0;
      while (beam) {
        const x1 = Math.max(a1x, a2x) + xDiff * i;
        const y1 = calculateY(rico, a1y, a2y, yDiff * i);
        const x2 = Math.min(a1x, a2x) - xDiff * i;
        const y2 = calculateY(-rico, a1y, a2y, yDiff * i);
        if ((x1 < 0 || y1 < 0 || x1 >= map[0].length || y1 >= map.length) && (x2 < 0 || y2 < 0 || x2 >= map[0].length || y2 >= map.length)) {
          break;
        }
        antiNodes.push([x1, y1]);
        antiNodes.push([x2, y2]);
        i++;
      }
      return antiNodes;
    }).filter(([x, y]) => x >= 0 && y >= 0 && x < map[0].length && y < map.length), ([x, y]) => `${x},${y}`);
}

function calculateY(rico, y1, y2, distance) {
  return rico > 0 ? Math.max(y1, y2) + distance : Math.min(y1, y2) - distance;
}

function parse(input) {
  return input.map(line => line.split(""));
}

module.exports = { A, B, parse };