const { findIndex, sortBy } = require("lodash");

const SCORES = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const REVERSE = {
  "(": ")",
  "{": "}",
  "[": "]",
  "<": ">",
};

const INCOMPLETE_SCORES = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

function A(lines) {
  return lines
    .filter(
      (line) =>
        line
          .replace(/\(/g, "")
          .replace(/{/g, "")
          .replace(/\[/g, "")
          .replace(/</g, "").length > 0
    )
    .map(
      (line) =>
        SCORES[
          line[
            findIndex(
              line,
              (v) => v === "]" || v === "}" || v === ")" || v === ">"
            )
          ]
        ]
    )
    .reduce((prev, x) => prev + x, 0);
}

function B(input) {
  const sortedScores = sortBy(
    input
      .filter(
        (line) =>
          line
            .replace(/\(/g, "")
            .replace(/{/g, "")
            .replace(/\[/g, "")
            .replace(/</g, "").length === 0
      )
      .map((line) =>
        line
          .split("")
          .map((c) => REVERSE[c])
          .reverse()
          .join("")
      )
      .map((line) =>
        line.split("").reduce((prev, x) => prev * 5 + INCOMPLETE_SCORES[x], 0)
      )
  );
  return sortedScores[Math.floor(sortedScores.length / 2)];
}

function parse(input) {
  return input
    .map((line) => {
      let workline = line;
      let l = 0;
      do {
        l = workline.length;
        workline = workline
          .replace(/\(\)/g, "")
          .replace(/{}/g, "")
          .replace(/\[\]/g, "")
          .replace(/<>/g, "");
      } while (workline.length !== l && workline.length > 0);
      return workline;
    })
    .filter((line) => line.length); // Correct lines are 0
}

module.exports = { A, B, parse };
