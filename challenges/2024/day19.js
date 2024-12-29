function A({ patterns, towels }) {
  return towels.filter((towel) => isTowelPossible(patterns, towel)).length;
}

function B({ patterns, towels }) {
  return towels
    .filter((towel) => isTowelPossible(patterns, towel))
    .map(towel => arrangements(new Set(patterns), towel))
    .reduce((acc, curr) => acc + curr, 0);
}

function arrangements(patterns, towel) {
  const counts = Array(towel.length + 1).fill(0);
  counts[0] = 1;
  for (let right = 1; right <= towel.length; right++) {
    for (let left = 0; left < right; left++) {
      if (patterns.has(towel.slice(left, right))) {
        counts[right] += counts[left];
      }
    }
  }
  return counts.at(-1);
}

function isTowelPossible(patterns, towel) {
  if (!towel) return true;
  let isPossible = false;
  for (let i = 0; i < towel.length; i++) {
    const pattern = patterns.find(pattern => pattern === towel.substring(0, i + 1));
    if (pattern) {
      isPossible = isTowelPossible(patterns, towel.substring(pattern.length));
    }
    if (isPossible) return true;
  }
  return isPossible;
}

function parse(input) {
  return {
    patterns: input[0].split(", "),
    towels: input.slice(2),
  };
}

module.exports = { A, B, parse };