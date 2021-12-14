const { maxBy, uniqBy } = require("lodash");

function A({ dots, instructions }) {
  return performInstructions(dots, [instructions[0]]).length;
}

function B({ dots, instructions }) {
  const result = performInstructions(dots, instructions);
  return readPaper(result);
}

function readPaper(paper) {
  const maxX = maxBy(paper, "x").x;
  let print = "";
  for (let i = 0; i < maxX + 1; i += 5) {
    if (isR(paper, i)) {
      print += "R";
    } else if (isP(paper, i)) {
      print += "P";
    } else if (isB(paper, i)) {
      print += "B";
    } else if (isC(paper, i)) {
      print += "C";
    } else if (isK(paper, i)) {
      print += "K";
    } else if (isF(paper, i)) {
      print += "F";
    }
  }
  return print;
}

function isR(paper, i) {
  return (
    paper.find((dot) => dot.x === i && dot.y === 0) &&
    paper.find((dot) => dot.x === i + 1 && dot.y === 0) &&
    paper.find((dot) => dot.x === i + 2 && dot.y === 0) &&
    paper.find((dot) => dot.x === i && dot.y === 1) &&
    paper.find((dot) => dot.x === i + 3 && dot.y === 1) &&
    paper.find((dot) => dot.x === i && dot.y === 2) &&
    paper.find((dot) => dot.x === i + 3 && dot.y === 2) &&
    paper.find((dot) => dot.x === i && dot.y === 3) &&
    paper.find((dot) => dot.x === i + 1 && dot.y === 3) &&
    paper.find((dot) => dot.x === i + 2 && dot.y === 3) &&
    paper.find((dot) => dot.x === i && dot.y === 4) &&
    paper.find((dot) => dot.x === i + 2 && dot.y === 4) &&
    paper.find((dot) => dot.x === i && dot.y === 5) &&
    paper.find((dot) => dot.x === i + 3 && dot.y === 5)
  );
}

function isP(paper, i) {
  return (
    paper.find((dot) => dot.x === i && dot.y === 0) &&
    paper.find((dot) => dot.x === i + 1 && dot.y === 0) &&
    paper.find((dot) => dot.x === i + 2 && dot.y === 0) &&
    paper.find((dot) => dot.x === i && dot.y === 1) &&
    paper.find((dot) => dot.x === i + 3 && dot.y === 1) &&
    paper.find((dot) => dot.x === i && dot.y === 2) &&
    paper.find((dot) => dot.x === i + 3 && dot.y === 2) &&
    paper.find((dot) => dot.x === i && dot.y === 3) &&
    paper.find((dot) => dot.x === i + 1 && dot.y === 3) &&
    paper.find((dot) => dot.x === i + 2 && dot.y === 3) &&
    paper.find((dot) => dot.x === i && dot.y === 4) &&
    paper.find((dot) => dot.x === i && dot.y === 5)
  );
}

function isB(paper, i) {
  return (
    paper.find((dot) => dot.x === i + 1 && dot.y === 0) &&
    paper.find((dot) => dot.x === i + 2 && dot.y === 0) &&
    paper.find((dot) => dot.x === i && dot.y === 1) &&
    paper.find((dot) => dot.x === i + 3 && dot.y === 1) &&
    paper.find((dot) => dot.x === i && dot.y === 2) &&
    paper.find((dot) => dot.x === i + 1 && dot.y === 2) &&
    paper.find((dot) => dot.x === i + 2 && dot.y === 2) &&
    paper.find((dot) => dot.x === i && dot.y === 3) &&
    paper.find((dot) => dot.x === i + 3 && dot.y === 3) &&
    paper.find((dot) => dot.x === i && dot.y === 4) &&
    paper.find((dot) => dot.x === i + 3 && dot.y === 4) &&
    paper.find((dot) => dot.x === i + 1 && dot.y === 5) &&
    paper.find((dot) => dot.x === i + 2 && dot.y === 5)
  );
}

function isC(paper, i) {
  return (
    paper.find((dot) => dot.x === i + 1 && dot.y === 0) &&
    paper.find((dot) => dot.x === i + 2 && dot.y === 0) &&
    paper.find((dot) => dot.x === i && dot.y === 1) &&
    paper.find((dot) => dot.x === i + 3 && dot.y === 1) &&
    paper.find((dot) => dot.x === i && dot.y === 2) &&
    paper.find((dot) => dot.x === i && dot.y === 3) &&
    paper.find((dot) => dot.x === i && dot.y === 4) &&
    paper.find((dot) => dot.x === i + 3 && dot.y === 4) &&
    paper.find((dot) => dot.x === i + 1 && dot.y === 5) &&
    paper.find((dot) => dot.x === i + 2 && dot.y === 5)
  );
}

function isK(paper, i) {
  return (
    paper.find((dot) => dot.x === i && dot.y === 0) &&
    paper.find((dot) => dot.x === i + 3 && dot.y === 0) &&
    paper.find((dot) => dot.x === i && dot.y === 1) &&
    paper.find((dot) => dot.x === i + 2 && dot.y === 1) &&
    paper.find((dot) => dot.x === i && dot.y === 2) &&
    paper.find((dot) => dot.x === i + 1 && dot.y === 2) &&
    paper.find((dot) => dot.x === i && dot.y === 3) &&
    paper.find((dot) => dot.x === i + 2 && dot.y === 3) &&
    paper.find((dot) => dot.x === i && dot.y === 4) &&
    paper.find((dot) => dot.x === i + 2 && dot.y === 4) &&
    paper.find((dot) => dot.x === i && dot.y === 5) &&
    paper.find((dot) => dot.x === i + 3 && dot.y === 5)
  );
}

function isF(paper, i) {
  return (
    paper.find((dot) => dot.x === i && dot.y === 0) &&
    paper.find((dot) => dot.x === i + 1 && dot.y === 0) &&
    paper.find((dot) => dot.x === i + 2 && dot.y === 0) &&
    paper.find((dot) => dot.x === i + 3 && dot.y === 0) &&
    paper.find((dot) => dot.x === i && dot.y === 1) &&
    paper.find((dot) => dot.x === i && dot.y === 2) &&
    paper.find((dot) => dot.x === i + 1 && dot.y === 2) &&
    paper.find((dot) => dot.x === i + 2 && dot.y === 2) &&
    paper.find((dot) => dot.x === i && dot.y === 3) &&
    paper.find((dot) => dot.x === i && dot.y === 4) &&
    paper.find((dot) => dot.x === i && dot.y === 5)
  );
}

function printPaper(paper) {
  const maxY = maxBy(paper, "y").y;
  const maxX = maxBy(paper, "x").x;
  let print = "\n";
  for (let y = 0; y < maxY + 1; y++) {
    for (let x = 0; x < maxX + 1; x++) {
      if (paper.find((dot) => dot.x === x && dot.y === y)) {
        print += "#";
      } else {
        print += " ";
      }
    }
    print += "\n";
  }
  console.log(print);
}

function performInstructions(dots, instructions) {
  let paper = [...dots];

  instructions.forEach((instruction) => {
    const max = { x: maxBy(paper, "x").x, y: maxBy(paper, "y").y };

    paper = paper.map((dot) => {
      if (dot[instruction.fold] > instruction.coordinate) {
        return {
          x: dot.x,
          y: dot.y,
          [instruction.fold]: max[instruction.fold] - dot[instruction.fold],
        };
      }
      return dot;
    });
  });

  return uniqBy(paper);
}

function parse(input) {
  const dots = [];
  const instructions = [];
  let d = true;
  for (let line of input) {
    if (line == "") {
      d = false;
      continue;
    }
    if (d) {
      const [x, y] = line.split(",").map(Number);
      dots.push({ x, y });
    } else {
      const [fold, coordinate] = line.replace("fold along ", "").split("=");
      instructions.push({ fold, coordinate: Number(coordinate) });
    }
  }
  return { dots, instructions };
}

module.exports = { A, B, parse };
