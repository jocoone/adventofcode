const directions = [
  [0, 1],   // right
  [0, -1],  // left
  [1, 0],   // down
  [-1, 0]   // up
];

function A({ maze, start, end, walls, path }) {
  return getCheats(walls, maze, 2)
    .map(cheat => findShortestPath(maze, start, end, cheat))
    .filter(path => path !== -1)
    .map(cheatPath => path - cheatPath)
    .filter(diff => diff >= 100).length;
}

function B({ maze, start, end, walls, path }) {
  //console.log(getCheats(walls, maze, 20).length);
  return getCheats(walls, maze, 20)
    .map(cheat => findShortestPath(maze, start, end, cheat))
    .filter(path => path !== -1)
    .map(cheatPath => path - cheatPath)
    .filter(diff => diff >= 50).length;
}



function getCheats(walls, maze, cheatSize) {
  const cheats = [];
  for (let [wallX, wallY] of walls) {
    for (let y =  Math.max(wallY - cheatSize, 0); y <= wallY + cheatSize - 1; y++) {
      for (let x = Math.max(wallX - cheatSize, 0); x <= wallX + cheatSize - 1; x++) {
        const distance = Math.abs(wallX - x) + Math.abs(wallY - y);
        if (distance > 0 && distance <= cheatSize - 1 && maze[y] && maze[y][x] !== '#') {
          cheats.push([wallX, wallY, x, y, distance]);
        }
      }
    }
  }
  return cheats
    .filter(([startX, startY, endX, endY, distance], index) => {
      // if (index % 10000 === 0) console.log(index);
      if (cheatSize === 2) return true;
      return findShortestPath(maze, [startX, startY], [endX, endY], [], '.', distance) !== -1;
    });
}

function getCheatsOld(walls, maze) {
  const cheats = [];
  for (let [wallX, wallY] of walls) {
    for (const [dr, dc] of directions) {
      const newX = wallX + dr;
      const newY = wallY + dc;
      if (maze[newY] && maze[newY][newX] && maze[newY][newX] !== '#') cheats.push([wallX, wallY, newX, newY, 2]);
    }
  }
  return cheats;
}

function findShortestPath(maze, start, end, [cheatX, cheatY, newCheatX, newCheatY, cheatDistance] = [], wall = '#', maxDistance = -1) {
  const rows = maze.length;
  const cols = maze[0].length;
  const queue = [[start[0], start[1], 0]]; // [row, col, distance]
  const visited = new Set();
  visited.add(`${start[0]},${start[1]}`);

  while (queue.length > 0) {
    const [x, y, dist] = queue.shift();

    if (maxDistance !== -1 && dist >= maxDistance) continue;

    // If the current position is the end position, return the distance
    if (x === end[0] && y === end[1]) {
      return dist;
    }

    // Explore all possible directions
    for (const [dr, dc] of directions) {
      const newX = x + dr;
      const newY = y + dc;

      if (cheatX === newX && cheatY === newY && !visited.has(`${newCheatX},${newCheatY}`)) {
        queue.push([newCheatX, newCheatY, dist + cheatDistance]);
        visited.add(`${newCheatX},${newCheatY}`);
      }else {
        // Check bounds and if the cell is not a wall and not yet visited
        if (
          newY >= 0 && newY < rows &&
          newX >= 0 && newX < cols &&
          maze[newY][newX] !== wall &&
          !visited.has(`${newX},${newY}`)
        ) {
          queue.push([newX, newY, dist + 1]);
          visited.add(`${newX},${newY}`);
        }
      }



    }
  }

  // If no path is found, return -1
  return -1;
}

function parse(input) {
  let start;
  let end;
  const walls = [];
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === "S") start = [x, y];
      if (input[y][x] === "E") end = [x, y];
      if (input[y][x] === '#') walls.push([x, y]);
    }
  }
  const maze = input.map(x => x.split(""));
  const path = findShortestPath(maze, start, end);
  return { maze, start, end, walls, path };
}

module.exports = { A, B, parse };