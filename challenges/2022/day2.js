const ROCK = "AX";
const PAPER = "BY";
const SCISSORS = "CZ";

const ORDER = ["A", "B", "C"];

const MAP = {
  X: "A",
  Y: "B",
  Z: "C",
};

const SCORES = {
  AA: 3,
  AB: 6,
  AC: 0,
  BA: 0,
  BB: 3,
  BC: 6,
  CA: 6,
  CB: 0,
  CC: 3,
};

const SCORESSSS = {
  X: 0,
  Y: 3,
  Z: 6,
};

function A(input) {
  return input
    .map((x) => {
      const hands = x.map((x) => MAP[x] || x);
      let score = 0;
      if (ROCK.includes(hands[1])) score += 1;
      if (PAPER.includes(hands[1])) score += 2;
      if (SCISSORS.includes(hands[1])) score += 3;
      score += SCORES[hands.join("")];
      return score;
    })
    .reduce((prev, curr) => prev + curr, 0);
}

function B(input) {
  return input
    .map((x) => {
      let score = SCORESSSS[x[1]];
      let handToPlay;

      if (score === 3) handToPlay = x[0];
      if (score === 6) handToPlay = ORDER[ORDER.indexOf(x[0]) + 1] || ORDER[0];
      if (score === 0) handToPlay = ORDER[ORDER.indexOf(x[0]) - 1] || ORDER[2];

      if (ROCK.includes(handToPlay)) score += 1;
      if (PAPER.includes(handToPlay)) score += 2;
      if (SCISSORS.includes(handToPlay)) score += 3;

      return score;
    })
    .reduce((prev, curr) => prev + curr, 0);
}

function parse(input) {
  return input.map((line) => {
    return line.split(" ");
  });
}

module.exports = { A, B, parse };
