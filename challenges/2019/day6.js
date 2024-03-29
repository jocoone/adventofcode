const { intersection, reverse } = require('lodash');

function calculateDirectOrbits(lines) {
  const solarSystem = {
    orbits: {},
  };
  lines.forEach((line) => {
    const info = line.split(')');
    const a = info[0];
    const b = info[1];
    if (!solarSystem.orbits[a]) {
      solarSystem.orbits[a] = [b];
    } else {
      solarSystem.orbits[a].push(b);
    }
  });
  return solarSystem;
}

function countOrbits(orbits, start, niveau) {
  if (orbits[start]) {
    let count = 0;

    orbits[start].forEach((o) => {
      count += countOrbits(orbits, o, niveau + 1);
    });

    return count + niveau;
  }
  return niveau;
}

function getStartObject(orbits, object) {
  const result = [];
  Object.keys(orbits).forEach((o) => {
    if (orbits[o].includes(object)) {
      result.push(o);
    }
  });
  return result[0];
}

function getPathToCOM(orbits, object) {
  let result = [object];
  let start = object;
  const keys = Object.keys(orbits);
  do {
    for (let i = 0; i < keys.length; i++) {
      const o = keys[i];
      if (orbits[o].includes(start)) {
        result.push(o);
        start = o;
      }
    }
  } while (result.indexOf('COM') < 0);
  return reverse(result);
}

function getSmallestOrbitalTransfers(orbits) {
  const startYou = getStartObject(orbits, 'YOU');
  const startSan = getStartObject(orbits, 'SAN');
  const youPathToCom = getPathToCOM(orbits, startYou);
  const sanPathToCom = getPathToCOM(orbits, startSan);
  const join = intersection(youPathToCom, sanPathToCom);
  return youPathToCom.length + sanPathToCom.length - 2 * join.length;
}

function A(solarSystem) {
  return countOrbits(solarSystem.orbits, 'COM', 0);
}

function B(solarSystem) {
  return getSmallestOrbitalTransfers(solarSystem.orbits);
}

function parse(input) {
  return calculateDirectOrbits(input);
}

module.exports = { A, B, parse };
