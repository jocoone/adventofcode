function A({ maze, start, end }) {
  return solve(maze, start, end).lowestScore;
}

function B({ maze, start, end }) {
  return solve(maze, start, end).uniqueSpots;
}

function parse(maze) {
  let start;
  let end;
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === "S") start = [x, y];
      if (maze[y][x] === "E") end = [x, y];
    }
  }
  return { maze: maze.map(x => x.split("")), start, end };
}

function solve(map, start, end) {
  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  const costMap = new Map();
  let lowestScore = Infinity;
  let uniqueSpots = new Set();

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] !== "#") costMap.set(`${x},${y}`, {
        "-1,0": Infinity,
        "0,1": Infinity,
        "1,0": Infinity,
        "0,-1": Infinity,
      });
    }
  }

  const queue = [];
  queue.push({
    position: start,
    direction: [1, 0],
    score: 0,
    path: new Set([`${start[0]},${start[1]}`]),
  });

  while (queue.length) {
    const { position: [x, y], direction, score, path } = queue.shift();
    if (score > lowestScore) continue;
    if (x === end[0] && y === end[1]) {
      if (score < lowestScore) {
        lowestScore = score;
        uniqueSpots = new Set(path);
      }
      else if (score === lowestScore) path.forEach(p => uniqueSpots.add(p));
      continue;
    }

    directions.forEach(([xChange, yChange]) => {
      const newY = y + yChange;
      const newX = x + xChange;
      let cost = score;

      if (map[newY][newX] === "#") return;
      if (direction[0] * xChange + direction[1] * yChange === -1) return;
      cost += (direction[0] * xChange + direction[1] * yChange === 1) ? 1 : 1001;

      if (costMap.get(`${newX},${newY}`)[`${xChange},${yChange}`] < cost) return;
      costMap.get(`${newX},${newY}`)[`${xChange},${yChange}`] = cost;

      queue.push({
        position: [newX, newY],
        direction: [xChange, yChange],
        score: cost,
        path: new Set([...path, `${newX},${newY}`]),
      });
    });
  }
  return { lowestScore, uniqueSpots: uniqueSpots.size };
}

module.exports = { A, B, parse };