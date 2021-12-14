const {
  maxBy,
  uniqBy,
  countBy,
  toPairs,
  minBy,
  max,
  min,
  fromPairs,
} = require("lodash");

function A(input) {
  return reinforceCompounds(input, 10);
}

function B(input) {
  return reinforceCompounds(input, 40);
}

function countCompounds(polymer) {
  return Object.values(countBy(polymer));
}

function reinforceCompounds({ polymer, pairInsertions }, steps) {
  let activePolymer = polymer;
  const matches = Array.from(
    activePolymer.matchAll(/(?=([A-Z][A-Z]))/g),
    (m) => m[1]
  );
  let countMap = countBy(matches);
  const result = countBy(polymer.split(""));
  for (let i = 0; i < steps; i++) {
    const newCounts = {};

    for (const [pair, increment] of Object.entries(countMap)) {
      const insertion = pairInsertions[pair];
      if (insertion) {
        const x1 = pair.substring(0, 1) + insertion;
        const x2 = insertion + pair.substring(1, 2);
        newCounts[x1] = newCounts[x1] ? newCounts[x1] + increment : increment;
        newCounts[x2] = newCounts[x2] ? newCounts[x2] + increment : increment;
        result[insertion[0]] = result[insertion[0]]
          ? result[insertion[0]] + increment
          : increment;
      } else {
        newCounts[pair] = newCounts[pair]
          ? newCounts[pair] + increment
          : increment;
      }
    }

    countMap = newCounts;
  }

  const p = Object.values(result);
  return maxBy(p) - minBy(p);
}

function parse(input) {
  const [polymer, _, ...pairInsertions] = input;
  return {
    polymer,
    pairInsertions: fromPairs(
      pairInsertions.map((pi) => {
        const [pair, insertion] = pi.split(" -> ");
        return [pair, insertion];
      })
    ),
  };
}

module.exports = { A, B, parse };
