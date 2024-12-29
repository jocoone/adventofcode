function A({ map, x, y }) {
  let direction = "up";
  let moves = new Set([`${x}-${y}`]);
  do {
    const { x: newX, y: newY } = move(direction, x, y);
    if (map[newY] && map[newY][newX] === "#") {
      direction = turn(direction);
    } else {
      x = newX;
      y = newY;
      if (map[y] && map[y][x] === ".") {
        moves.add(`${x}-${y}`);
      }
    }
  } while (x >= 0 && x < map[0].length && y >= 0 && y < map.length);
  return moves.size;
}

function B({ map, x, y }) {
  const originalX = x;
  const originalY = y;
  let direction = "up";
  const originalDirection = direction;
  let loops = 0;
  for (let yy = 0; yy < map.length; yy++) {
    for (let xx = 0; xx < map[yy].length; xx++) {
      let moves = new Set();
      moves.add(`${x}-${y}-${direction}`);
      if (map[yy][xx] === ".") {
        map[yy][xx] = "#";

        do {
          const { x: newX, y: newY } = move(direction, x, y);
          if (map[newY] && map[newY][newX] === "#") {
            direction = turn(direction);
          } else {
            if (moves.has(`${newX}-${newY}-${direction}`)) {
              loops++;
              break;
            }
            x = newX;
            y = newY;
            if (map[y] && map[y][x] === ".") {
              moves.add(`${x}-${y}-${direction}`);
            }
          }

        } while (x >= 0 && x < map[0].length && y >= 0 && y < map.length);

        x = originalX;
        y = originalY;
        direction = originalDirection;
        map[yy][xx] = ".";
      }
    }
  }
  return loops;
}

function turn(direction) {
  switch (direction) {
    case "up":
      return "right";
    case "right":
      return "down";
    case "down":
      return "left";
    case "left":
      return "up";
  }
}

function move(direction, x, y) {
  switch (direction) {
    case "up":
      return { x, y: y - 1 };
    case "right":
      return { x: x + 1, y };
    case "down":
      return { x, y: y + 1 };
    case "left":
      return { x: x - 1, y };
  }
}

function parse(input) {
  const map = input.map(row => row.split(""));
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] !== "." && map[y][x] !== "#") {
        return {
          map, x, y,
        };
      }
    }
  }
}

module.exports = { A, B, parse };