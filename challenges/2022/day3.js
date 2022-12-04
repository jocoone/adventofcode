function A(rucksacks) {
  const intersections = rucksacks
    .map((line) => [
      line.substring(0, line.length / 2),
      line.substring(line.length / 2),
    ])
    .map((compartments) => getIntersection(compartments[0], compartments[1]));

  return calculateItemValues(intersections);
}

function B(rucksacks) {
  const intersections = [];
  for (let i = 0; i < rucksacks.length; i += 3) {
    intersections.push(
      getIntersection(rucksacks[i], rucksacks[i + 1], rucksacks[i + 2])
    );
  }
  return calculateItemValues(intersections);
}

function parse(input) {
  return input;
}

function calculateItemValues(values) {
  return values
    .map(calculateItemTypeValue)
    .reduce((prev, curr) => prev + curr, 0);
}

function calculateItemTypeValue(value) {
  return value.charCodeAt(0) - (value.toUpperCase() === value ? 38 : 96);
}

function getIntersection(value, ...others) {
  return value
    .split("")
    .filter((part) =>
      others
        .map((x) => x.includes(part))
        .reduce((prev, curr) => prev || curr, false)
    )[0];
}

module.exports = { A, B, parse };
