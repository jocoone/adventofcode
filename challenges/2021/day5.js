const { groupBy, countBy } = require('lodash');

function A(input) {
  const coveredPoints = countBy(
    input.filter((point) => !point.diagonal),
    (point) => `${point.x}-${point.y}`
  );
  return Object.values(coveredPoints).filter((x) => x >= 2).length;
}

function B(input) {
  const coveredPoints = countBy(input, (point) => `${point.x}-${point.y}`);
  return Object.values(coveredPoints).filter((x) => x >= 2).length;
}

function parse(input) {
  const points = [];

  input
    .map((line) => line.split(' -> '))
    .map((points) => {
      const one = points[0].split(',').map(Number);
      const two = points[1].split(',').map(Number);
      return { x1: one[0], y1: one[1], x2: two[0], y2: two[1] };
    })
    .forEach((vent) => {
      if (vent.x1 === vent.x2) {
        for (
          let y = vent.y1 > vent.y2 ? vent.y2 : vent.y1;
          y <= (vent.y1 > vent.y2 ? vent.y1 : vent.y2);
          y++
        ) {
          points.push({ x: vent.x1, y });
        }
      } else if (vent.y1 === vent.y2) {
        for (
          let x = vent.x1 > vent.x2 ? vent.x2 : vent.x1;
          x <= (vent.x1 > vent.x2 ? vent.x1 : vent.x2);
          x++
        ) {
          points.push({ x, y: vent.y1 });
        }
      } else if (vent.y1 > vent.y2) {
        for (let y = vent.y1, x = vent.x1; y >= vent.y2; y--) {
          points.push({ x, y, diagonal: true });
          if (vent.x1 > vent.x2) {
            x--;
          } else {
            x++;
          }
        }
      } else if (vent.y1 < vent.y2) {
        for (let y = vent.y1, x = vent.x1; y <= vent.y2; y++) {
          points.push({ x, y, diagonal: true });
          if (vent.x1 > vent.x2) {
            x--;
          } else {
            x++;
          }
        }
      }
    });
  return points;
}

module.exports = { A, B, parse };
