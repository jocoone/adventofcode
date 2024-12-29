const xSize = 101;
const ySize = 103;

function A(robots) {
  const newPositions = moveRobots(robots, xSize, ySize, 100);
  const xMiddle = Math.floor(xSize / 2);
  const yMiddle = Math.floor(ySize / 2);
  let quadrantOne = 0, quadrantTwo = 0, quadrantThree = 0, quadrantFour = 0;
  newPositions.forEach(({ x, y }) => {
    if (x < xMiddle && y < yMiddle) quadrantOne++;
    else if (x > xMiddle && y < yMiddle) quadrantTwo++;
    else if (x < xMiddle && y > yMiddle) quadrantThree++;
    else if (x > xMiddle && y > yMiddle) quadrantFour++;
  });
  return quadrantOne * quadrantTwo * quadrantThree * quadrantFour;
}

function moveRobots(robots, xSize, ySize, seconds) {
  return robots.map(({ x, y, xVel, yVel }) => {
    let newX = (x + xVel * seconds) % xSize;
    let newY = (y + yVel * seconds) % ySize;
    newX = newX < 0 ? newX + xSize : Math.abs(newX);
    newY = newY < 0 ? newY + ySize : Math.abs(newY);
    return { x: newX, y: newY };
  });
}

function B(robots) {
  let i = 1;
  while (true) {
    const newPositions = moveRobots(robots, xSize, ySize, i++);
    if (isRow(newPositions)) {
      // printRobots(newPositions, xSize, ySize);
      return i;
    }
  }
}

function isRow(robots) {
  return robots.find(({ x, y }) => robots.find(({
                                                  x: x2,
                                                  y: y2,
                                                }) => x === x2 - 1 && y === y2 && robots.find(({
                                                                                                 x: x3,
                                                                                                 y: y3,
                                                                                               }) => x2 === x3 - 1 && y === y3 && robots.find(({
                                                                                                                                                 x: x4,
                                                                                                                                                 y: y4,
                                                                                                                                               }) => x3 === x4 - 1 && y === y4 && robots.find(({
                                                                                                                                                                                                 x: x5,
                                                                                                                                                                                                 y: y5,
                                                                                                                                                                                               }) => x4 === x5 - 1 && y === y5 && robots.find(({
                                                                                                                                                                                                                                                 x: x6,
                                                                                                                                                                                                                                                 y: y6,
                                                                                                                                                                                                                                               }) => x5 === x6 - 1 && y === y6 && robots.find(({
                                                                                                                                                                                                                                                                                                 x: x7,
                                                                                                                                                                                                                                                                                                 y: y7,
                                                                                                                                                                                                                                                                                               }) => x6 === x7 - 1 && y === y7 && robots.find(({
                                                                                                                                                                                                                                                                                                                                                 x: x8,
                                                                                                                                                                                                                                                                                                                                                 y: y8,
                                                                                                                                                                                                                                                                                                                                               }) => x7 === x8 - 1 && y === y8))))))));
}

function printRobots(robots, xSize, ySize) {
  const grid = Array.from({ length: ySize }, () => Array.from({ length: xSize }, () => "."));
  robots.forEach(({ x, y }) => grid[y][x] = "#");
  console.log(grid.map(row => row.join("")).join("\n"));
}

function parse(input) {
  return input.map(line => {
    const [position, velocity] = line.split(" ");
    const [x, y] = position.slice(2).split(",").map(Number);
    const [xVel, yVel] = velocity.slice(2).split(",").map(Number);
    return { x, y, xVel, yVel };
  });
}

module.exports = { A, B, parse };