function A(input) {
  let largestY = Object.keys(input)
    .map((x) => +x.split("_")[1])
    .reduce((prev, curr) => (prev > curr ? prev : curr), 0);

  return floatSand(input, (sand) => sand.y > largestY + 1);
}

function B(input) {
  let floor =
    Object.keys(input)
      .map((x) => +x.split("_")[1])
      .reduce((prev, curr) => (prev > curr ? prev : curr), 0) + 2;
  const xx = Object.keys(input).map((x) => +x.split("_")[0]);
  let minX = Math.min(...xx) - 1000;
  let maxX = Math.max(...xx) + 1000;

  for (let x = minX; x < maxX; x++) {
    input[`${x}_${floor}`] = "#";
  }

  return floatSand(input, () => !!input[`500_0`]);
}

function floatSand(input, stop) {
  const sand = { x: 500, y: 0 };

  while (true) {
    if (input[`${sand.x}_${sand.y + 1}`]) {
      if (input[`${sand.x - 1}_${sand.y + 1}`]) {
        if (input[`${sand.x + 1}_${sand.y + 1}`]) {
          input[`${sand.x}_${sand.y}`] = "o";
          sand.x = 500;
          sand.y = 0;
        } else {
          sand.x++;
          sand.y++;
        }
      } else {
        sand.x--;
        sand.y++;
      }
    } else {
      sand.y++;
    }
    if (stop(sand)) {
      break;
    }
  }
  return Object.values(input).filter((x) => x === "o").length;
}

function print(input) {
  let largestY =
    Object.keys(input)
      .filter((x) => input[x] === "o")
      .map((x) => +x.split("_")[1])
      .reduce((prev, curr) => (prev > curr ? prev : curr), 0) + 5;
  let largestX =
    +Object.keys(input)
      .filter((x) => input[x] === "o")
      .map((x) => +x.split("_")[0])
      .reduce((prev, curr) => (prev > curr ? prev : curr), 0) + 10;
  let smallestY =
    Object.keys(input)
      .map((x) => +x.split("_")[1])
      .reduce(
        (prev, curr) => (prev < curr ? prev : curr),
        Number.MAX_SAFE_INTEGER
      ) - 10;
  let smallestX =
    Object.keys(input)
      .map((x) => +x.split("_")[0])
      .reduce(
        (prev, curr) => (prev < curr ? prev : curr),
        Number.MAX_SAFE_INTEGER
      ) - 1;
  for (let y = 0; y < largestY; y++) {
    let line = "";
    for (let x = smallestX; x < largestX; x++) {
      if (x === 500 && y === 0) {
        line += "X";
      } else {
        line += input[`${x}_${y}`] || ".";
      }
    }
    console.log(line, y);
  }
  console.log(smallestX, largestX, smallestY, largestY);
}

function parse(input) {
  const rock = {};
  input
    .map((line) => line.split(" -> ").map((x) => x.split(",").map((t) => +t)))
    .forEach((s) => {
      for (let i = 1; i < s.length; i++) {
        const [ax, ay] = s[i - 1];
        const [bx, by] = s[i];
        let minX = Math.min(ax, bx);
        let minY = Math.min(ay, by);
        let maxX = Math.max(ax, bx);
        let maxY = Math.max(ay, by);
        for (let y = minY; y <= maxY; y++) {
          for (let x = minX; x <= maxX; x++) {
            rock[`${x}_${y}`] = "#";
          }
        }
      }
    });
  return rock;
}

module.exports = { A, B, parse };
