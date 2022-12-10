const x = 0;
const y = 1;

function A(input) {
  const visited = moveKnots(
    [
      [0, 0],
      [0, 0],
    ],
    input
  );

  return Object.keys(visited).length;
}

function B(input) {
  const knots = Array.from({ length: 10 }, () => [0, 0]);
  const visited = moveKnots(knots, input);

  return Object.keys(visited).length;
}

function moveKnots(knots, input) {
  const visited = { "0-0": 1 };
  input.forEach(([direction, amount]) => {
    for (let move = 0; move < amount; move++) {
      moveKnot(knots[0], direction);
      for (let k = 1; k < knots.length; k++) {
        moveTail(knots[k - 1], knots[k], direction);
      }
      visited[knots[knots.length - 1].join("-")] = 1;
    }
  });
  return visited;
}

function moveKnot(knot, direction) {
  if (direction === "R") {
    knot[x]++;
  } else if (direction === "L") {
    knot[x]--;
  } else if (direction === "U") {
    knot[y]--;
  } else {
    knot[y]++;
  }
}

function moveTail(head, tail) {
  if (Math.abs(head[x] - tail[0]) > 1 || Math.abs(head[y] - tail[1]) > 1) {
    if (head[y] === tail[1]) {
      moveKnot(tail, head[x] > tail[0] ? "R" : "L");
    } else if (head[x] === tail[0]) {
      moveKnot(tail, head[y] > tail[1] ? "D" : "U");
    } else {
      moveKnot(tail, head[x] > tail[0] ? "R" : "L");
      moveKnot(tail, head[y] > tail[1] ? "D" : "U");
    }
  }
}

function parse(input) {
  return input.map((line) => {
    return line.split(" ");
  });
}

module.exports = { A, B, parse };
