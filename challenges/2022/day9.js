function A(input) {
  const visited = ["0-0"];
  const head = [0, 0];
  const tail = [0, 0];
  input.forEach(([direction, amount]) => {
    for (let i = 0; i < amount; i++) {
      move(head, tail, direction);
      visited.push(tail.join("-"));
    }
  });

  return new Set(visited).size;
}

function move(head, tail, direction) {
  moveHead(head, direction);
  moveTail(head, tail);
}

function moveHead(head, direction) {
  if (direction === "R") {
    head[0]++;
  } else if (direction === "L") {
    head[0]--;
  } else if (direction === "U") {
    head[1]--;
  } else {
    head[1]++;
  }
}

function moveTail(head, tail) {
  if (Math.abs(head[0] - tail[0]) >= 2 || Math.abs(head[1] - tail[1]) >= 2) {
    // issue
    if (head[1] === tail[1]) {
      if (head[0] > tail[0]) {
        tail[0]++;
      } else {
        tail[0]--;
      }
    } else if (head[0] === tail[0]) {
      if (head[1] > tail[1]) {
        tail[1]++;
      } else {
        tail[1]--;
      }
    } else {
      if (head[0] > tail[0]) {
        tail[0]++;
      } else {
        tail[0]--;
      }
      if (head[1] > tail[1]) {
        tail[1]++;
      } else {
        tail[1]--;
      }
    }
  }
}

function B(input) {
  const visited = ["0-0"];
  const knots = Array.from({ length: 10 }, () => [0, 0]);

  input.forEach(([direction, amount]) => {
    for (let i = 0; i < amount; i++) {
      moveHead(knots[0], direction);
      for (let k = 1; k < knots.length; k++) {
        moveTail(knots[k - 1], knots[k], direction);
      }
      visited.push(knots[knots.length - 1].join("-"));
    }
  });

  return new Set(visited).size;
}

function parse(input) {
  return input.map((line) => {
    return line.split(" ");
  });
}

module.exports = { A, B, parse };
