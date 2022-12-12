function findShortestRoute(grid, position, end, check = () => true) {
  var queue = [[position]]; // path options
  let visited = new Set([`${position.x}-${position.y}`]);

  while (queue.length > 0) {
    var path = queue.shift(); // get the path out of the queue
    var pos = path[path.length - 1]; // ... and then the last position from it
    [
      [pos.x + 1, pos.y],
      [pos.x - 1, pos.y],
      [pos.x, pos.y + 1],
      [pos.x, pos.y - 1],
    ]
      .filter(([x, y]) => grid[y] && grid[y][x])
      .filter(([x, y]) => !visited.has(`${x}-${y}`))
      .filter(([x, y]) => check({ x, y }, pos))
      .forEach(([x, y]) => {
        visited.add(`${x}-${y}`);
        queue.push(path.concat([{ x, y }]));
      });

    const { x, y } = path[path.length - 1];
    if (x == end.x && y == end.y && check(end, pos)) return path;
  }

  return queue;
}

module.exports = { findShortestRoute };
