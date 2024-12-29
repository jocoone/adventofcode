const GRID_SIZE = 71;

function A(bytes) {
  return getPath(bytes, 1024).length - 1
}

function B(bytes) {
  let numberOfBytes = 1024;
  let path;
  do {
    path = getPath(bytes, numberOfBytes);
    numberOfBytes++;
  } while (path);
  const [x, y] = bytes[numberOfBytes - 2];
  return `${x},${y}`;
}

function getPath(bytes, cutOff) {
  const fallingBytes = bytes.slice(0, cutOff);
  return findPath(fallingBytes, [0, 0], [GRID_SIZE - 1, GRID_SIZE - 1], GRID_SIZE);
}

function findPath(bytes, start, end, gridSize) {
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  const queue = [[start, []]];
  const visited = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));

  visited[start[0]][start[1]] = true;

  while (queue.length > 0) {
    const [[currentX, currentY], path] = queue.shift();

    if (currentX === end[0] && currentY === end[1]) {
      return path.concat([[currentX, currentY]]);
    }

    for (const [dr, dc] of directions) {
      const newY = currentY + dc;
      const newX = currentX + dr;

      if (isValid(newY, newX, visited, gridSize, bytes)) {
        visited[newY][newX] = true;
        queue.push([[newX, newY], path.concat([[currentX, currentY]])]);
      }
    }
  }

  return null; // No path found
}

function isValid(newY, newX, visited, gridSize, bytes) {
  return newY >= 0 && newX >= 0 && newY < gridSize && newX < gridSize &&
    !bytes.find(([x, y]) => x === newX && y === newY) && !visited[newY][newX];
}

function parse(input) {
  return input.map(line => line.split(",").map(Number));
}

module.exports = { A, B, parse };