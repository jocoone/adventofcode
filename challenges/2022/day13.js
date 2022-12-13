function A(input) {
  return input
    .map(([left, right], index) => {
      if (compareSignal(left, right)) return index + 1;
      return 0;
    })
    .reduce((prev, curr) => prev + curr, 0);
}

function B(input) {
  const sorted = [...input.flat(), [[2]], [[6]]].sort((a, b) => {
    const result = compareSignal(a, b);
    if (result === undefined) return 0;
    return result ? -1 : 1;
  });
  const two = sorted.findIndex((x) => x.toString() == "2") + 1;
  const six = sorted.findIndex((x) => x.toString() == "6") + 1;
  return two * six;
}

function compareSignal(left, right) {
  if (left === undefined || right === undefined) return left === undefined;
  else if (typeof left === "object" && typeof right === "object")
    return compareArrays(left, right);
  else if (typeof left === "number" && typeof right === "number")
    return compareNumbers(left, right);
  else if (typeof left === "number") return compareSignal([left], right);
  else if (typeof right === "number") return compareSignal(left, [right]);
}

function compareNumbers(left, right) {
  return left === right ? undefined : left < right;
}

function compareArrays(left, right) {
  for (
    let l = 0;
    l < left.length > right.length ? left.length : right.length;
    l++
  ) {
    const result = compareSignal(left[l], right[l]);
    if (result === undefined) continue;
    return result;
  }
  return undefined;
}

function parse(input) {
  const pairs = [];
  for (let i = 0; i < input.length; i += 3) {
    const left = parseSignal(input[i]);
    const right = parseSignal(input[i + 1]);

    pairs.push([left, right]);
  }
  return pairs;
}

function parseSignal(signal) {
  return eval(signal);
}

module.exports = { A, B, parse };
