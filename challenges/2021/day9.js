const { sortBy } = require('lodash');

function A({ lowPoints }) {
  return lowPoints
    .map((x) => x.height)
    .map((x) => x + 1)
    .reduce((prev, x) => prev + x, 0);
}

function findLowPoints(heights) {
  const lowPoints = [];
  for (let y = 0; y < heights.length; y++) {
    for (let x = 0; x < heights[y].length; x++) {
      if (y > 0 && heights[y - 1][x] <= heights[y][x]) {
        continue;
      }
      if (x < heights[y].length - 1 && heights[y][x + 1] <= heights[y][x]) {
        continue;
      }
      if (y < heights.length - 1 && heights[y + 1][x] <= heights[y][x]) {
        continue;
      }
      if (x > 0 && heights[y][x - 1] <= heights[y][x]) {
        continue;
      }
      lowPoints.push({ x, y, height: heights[y][x] });
    }
  }
  return lowPoints;
}

function B({ lowPoints, heights }) {
  const checkedPoints = [];
  const sortedBasins = sortBy(
    lowPoints.map((point) =>
      getBasin(heights, point.x, point.y, null, checkedPoints)
    )
  );
  return [sortedBasins.pop(), sortedBasins.pop(), sortedBasins.pop()].reduce(
    (prev, x) => prev * x,
    1
  );
}

function printGrid(heights, checkedPoints) {
  let grid = '';
  for (let y = 0; y < heights.length; y++) {
    let row = '';
    for (let x = 0; x < heights[y].length; x++) {
      if (checkedPoints.find((point) => point.x === x && point.y === y)) {
        row += `(${heights[y][x]}) `;
      } else {
        row += ` ${heights[y][x]}  `;
      }
    }
    grid += row + '\n';
  }
  console.log(grid);
}

function getBasin(heights, x, y, dir, checkedPoints) {
  let basin = 1;
  const notused = !checkedPoints.find(
    (point) => point.x === x && point.y === y
  );
  if (!notused || heights[y][x] === 9) {
    return 0;
  }
  checkedPoints.push({ x, y });
  if (dir !== 'left' && heights[y][x - 1] > heights[y][x]) {
    basin += getBasin(heights, x - 1, y, 'right', checkedPoints);
  }
  if (dir !== 'up' && heights[y - 1] && heights[y - 1][x] > heights[y][x]) {
    basin += getBasin(heights, x, y - 1, 'down', checkedPoints);
  }
  if (dir !== 'right' && heights[y][x + 1] > heights[y][x]) {
    basin += getBasin(heights, x + 1, y, 'left', checkedPoints);
  }
  if (dir !== 'down' && heights[y + 1] && heights[y + 1][x] > heights[y][x]) {
    basin += getBasin(heights, x, y + 1, 'up', checkedPoints);
  }
  return basin;
}

function parse(input) {
  const heights = input.map((line) => line.split('').map(Number));
  return { heights, lowPoints: findLowPoints(heights) };
}

module.exports = { A, B, parse };
