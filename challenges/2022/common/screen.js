const { findLetter } = require("../../../utils/util");

class Screen {
  constructor() {
    this.CRT = ["", "", "", "", "", ""];
  }

  addToRow(row, active) {
    this.CRT[row] += active ? "#" : " ";
  }

  getCRT() {
    const letters = [];
    for (let i = 0; i < 8; i++) {
      const letterCharacters = this.CRT.map((line) =>
        line.slice(i * 5, i * 5 + 4)
      ).join("");
      letters.push(findLetter(letterCharacters, "#"));
    }
    return letters.join("");
  }

  printCRT() {
    console.log(this.CRT.join("\n"));
  }
}

module.exports = { Screen };
