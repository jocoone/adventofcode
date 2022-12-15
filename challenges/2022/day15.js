function A([sensors, beacons]) {
  const signals = new Set();
  const MAGIC_NUMBER = 2000000;

  sensors.forEach((sensor) => {
    const [sensorX, , distance] = sensor;
    for (let x = sensorX - distance; x < sensorX + distance; x++) {
      if (getDistance(sensor, [x, MAGIC_NUMBER]) <= distance) {
        signals.add(x);
      }
    }
  });

  const beaconsOnRow =
    Array.from(beacons.entries)
      .filter(([, [, beaconY]]) => beaconY === MAGIC_NUMBER)
      .map(([, [beaconX]]) => beaconX).length - 1;
  return signals.size - beaconsOnRow;
}

function getDistance([sensorX, sensorY], [beaconX, beaconY]) {
  return Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);
}

function intersect([p1X, p1Y], [p2X, p2Y], [p3X, p3Y], [p4X, p4Y]) {
  const yDistanceP1P2 = p2Y - p1Y;
  const xDistanceP1P2 = p1X - p2X;
  const coefficientP1P2 = yDistanceP1P2 * p1X + xDistanceP1P2 * p1Y;

  const yDistanceP3P4 = p4Y - p3Y;
  const xDistanceP3P4 = p3X - p4X;
  const coefficientP3P4 = yDistanceP3P4 * p3X + xDistanceP3P4 * p3Y;

  const distance =
    yDistanceP1P2 * xDistanceP3P4 - yDistanceP3P4 * xDistanceP1P2;

  if (distance === 0) {
    return [-1, -1]; // no intersection
  }

  const x = Math.round(
    (xDistanceP3P4 * coefficientP1P2 - xDistanceP1P2 * coefficientP3P4) /
      distance
  );
  const y = Math.round(
    (yDistanceP1P2 * coefficientP3P4 - yDistanceP3P4 * coefficientP1P2) /
      distance
  );

  return [x, y];
}

function B([sensors, , coverage]) {
  const MAGIC_NUMBER = 4000000;

  for (let i = 0; i < coverage.length - 1; i++) {
    const coverage1 = coverage[i];
    const coverage2 = coverage[i + 1];

    for (let cornerCoverage1 = 0; cornerCoverage1 < 4; cornerCoverage1++) {
      for (let cornerCoverage2 = 0; cornerCoverage2 < 4; cornerCoverage2++) {
        const [xCoverage, yCoverage] = intersect(
          coverage1[cornerCoverage1],
          coverage1[(cornerCoverage1 + 1) % 4],
          coverage2[cornerCoverage2],
          coverage2[(cornerCoverage2 + 1) % 4]
        );
        if (
          [xCoverage, yCoverage].every(
            (coverageCoordinate) =>
              coverageCoordinate >= 0 && coverageCoordinate <= MAGIC_NUMBER
          ) &&
          sensors.every(
            ([x, y, d]) => getDistance([x, y], [xCoverage, yCoverage]) > d
          )
        ) {
          return 4000000 * xCoverage + yCoverage;
        }
      }
    }
  }
}

const regex = new RegExp("at x=(-?\\d+), y=(-?\\d+)");
function parse(input) {
  const sensors = [];
  const coverages = [];
  const beacons = new Set();
  input.forEach((line) => {
    const [sensorData, beaconData] = line.split(": closest ");
    const [_, sensorX, sensorY] = regex.exec(sensorData);
    const [, beaconX, beaconY] = regex.exec(beaconData);
    const sensor = [+sensorX, +sensorY];
    const beacon = [+beaconX, +beaconY];
    const distance = getDistance(sensor, beacon) + 1;
    sensor.push(distance - 1);

    sensors.push(sensor);
    beacons.add(beacon);
    coverages.push([
      [+sensorX + distance, +sensorY], // right
      [+sensorX, +sensorY + distance], // down
      [+sensorX - distance, +sensorY], // left
      [+sensorX, +sensorY - distance], // top
    ]);
  });
  return [sensors, beacons, coverages];
}

module.exports = { A, B, parse };
