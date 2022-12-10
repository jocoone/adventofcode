const { uniqBy, find } = require("lodash");
const IntCodeRunner = require("../../common/icc");
const ALPHABET = {
  A: " XX X  XX  XXXXXX  XX  X",
  B: "XXX X  XXXX XXX X  XXXX ",
  C: " XX X  XX   X   X  X XX ",
  D: "XXX X  XX  XX  XX  XXXX ",
  E: "XXXXX   XXX X   X   XXXX",
  F: "XXXXX   XXX X   X   X   ",
  G: " XX X  XX   X XXX  X XXX",
  H: "X  XX  XXXXXX  XX  XX  X",
  I: "",
  J: "XXXX   X   X   X   XXXX ",
  K: "X  XX X XX  X X X X X  X",
  L: "X   X   X   X   X   XXXX",
  M: "",
  N: "",
  O: " XX X  XX  XX  XX  X XX ",
  P: "XXX X  XXXX X   X   X   ",
  Q: "",
  R: "XXX X  XX  XXXX X X X  X",
  S: " XX X  XXXX    X   XXXX ",
  T: "",
  U: "X  XX  XX  XX  XX  X XX ",
  V: "",
  W: "",
  X: "",
  Y: "",
  Z: "XXXX   X  X  X  X   XXXX",
};
const LEFT = 0;

class Painter {
  constructor(input) {
    this.direction = "UP";
    this.program = new IntCodeRunner(input, [], 2);
    this.coordinates = [];
    this.lastX = 0;
    this.lastY = 0;
  }

  movePointer(turn) {
    if (this.direction === "UP") {
      this.direction = turn === LEFT ? "LEFT" : "RIGHT";
    } else if (this.direction === "DOWN") {
      this.direction = turn === LEFT ? "RIGHT" : "LEFT";
    } else if (this.direction === "RIGHT") {
      this.direction = turn === LEFT ? "UP" : "DOWN";
    } else {
      this.direction = turn === LEFT ? "DOWN" : "UP";
    }
    if (this.direction === "UP") {
      this.lastY++;
    } else if (this.direction === "DOWN") {
      this.lastY--;
    } else if (this.direction === "RIGHT") {
      this.lastX++;
    } else {
      this.lastX--;
    }
  }

  draw(startColor = 0) {
    do {
      const coordinate = find(this.coordinates, {
        x: this.lastX,
        y: this.lastY,
      });
      const result = this.program.run(
        coordinate ? coordinate.color : startColor
      );
      const [color, turn] = result;
      if (coordinate) {
        coordinate.color = color;
      } else {
        this.coordinates.push({ x: this.lastX, y: this.lastY, color });
      }
      this.movePointer(turn);
      this.program.clear();
    } while (!this.program.terminated);
  }

  visualise(result) {
    let smallestX = 0;
    let smallestY = 0;
    let largestX = 0;
    let largestY = 0;
    for (let i = 0; i < result.length; i++) {
      const coordinate = result[i];
      if (coordinate.x < smallestX) {
        smallestX = coordinate.x;
      }
      if (coordinate.y < smallestY) {
        smallestY = coordinate.y;
      }
      if (coordinate.x > largestX) {
        largestX = coordinate.x;
      }
      if (coordinate.y > largestY) {
        largestY = coordinate.y;
      }
    }
    let rule = [];
    for (let y = largestY; y > smallestY - 1; y--) {
      let row = [];
      for (let x = smallestX + 1; x < largestX; x++) {
        const coordinate = find(result, { x, y });
        if (coordinate && coordinate.color === 1) {
          row.push("X");
        } else {
          row.push(" ");
        }
      }
      rule.push(row);
    }
    return rule;
  }

  clear() {
    this.direction = "UP";
    this.coordinates = [];
    this.lastX = 0;
    this.lastY = 0;
  }
}

function A(painter) {
  painter.draw(0);

  const result = uniqBy(painter.coordinates, (x) => x.x + "-" + x.y).length;
  //painter.clear();
  return result;
}

function B(painter) {
  painter.draw(1);
  const visualisation = painter.visualise(painter.coordinates);
  const letters = [];
  for (let i = 0; i < 8; i++) {
    let letter = "";
    for (let y = 0; y < visualisation.length; y++) {
      for (let x = 0; x < visualisation[y].length; x++) {
        if (x >= letters.length * 5 && x < letters.length * 5 + 4) {
          letter += visualisation[y][x];
        }
      }
    }
    letters.push(letter);
  }

  const sentence = letters
    .map((letter) => {
      const a = Object.keys(ALPHABET);
      for (let i = 0; i < a.length; i++) {
        if (ALPHABET[a[i]] === letter) {
          return a[i];
        }
      }
    })
    .join("");

  return sentence;
}

function parse(input) {
  const visuals = input[0].split(",").map(Number);
  return new Painter(visuals);
}

module.exports = {
  A,
  B,
  parse,
};
