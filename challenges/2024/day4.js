function A(input) {
  let result = 0;
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const words = [
        input[y].slice(x, x + 4).join(""),
        input.slice(y, y + 4).map(row => row[x]).join(""),
        input.slice(y, y + 4).map((row, i) => row[x + i]).join(""),
        input.slice(y, y + 4).map((row, i) => row[x - i]).join(""),
      ];
      result += words.filter(word => word.includes("XMAS") || word.includes("SAMX")).length;
    }
  }
  return result;
}

function B(input) {
  let result = 0;
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === "A") {
        if (((input[y - 1] && input[y - 1][x - 1] === "M" && input[y + 1] && input[y + 1][x + 1] === "S") || (input[y - 1] && input[y - 1][x - 1] === "S" && input[y + 1] && input[y + 1][x + 1] === "M")) && ((input[y - 1] && input[y - 1][x + 1] === "M" && input[y + 1] && input[y + 1][x - 1] === "S") || (input[y - 1] && input[y - 1][x + 1] === "S" && input[y + 1] && input[y + 1][x - 1] === "M"))) {
          result++;
        }
      }
    }
  }
  return result;
}

function parse(input) {
  return input.map(row => row.split(""));
}

module.exports = { A, B, parse };