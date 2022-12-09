function A(input) {
  let visible = 0;
  for (let y = 1; y < input.length - 1; y++) {
    for (let x = 1; x < input.length - 1; x++) {
      const tree = input[y][x];
      const [up, right, down, left] = getDirections(x, y, input);

      if (
        isVisible(tree, up) ||
        isVisible(tree, right) ||
        isVisible(tree, down) ||
        isVisible(tree, left)
      ) {
        visible++;
      }
    }
  }
  return visible + input.length * 2 + (input.length - 2) * 2;
}

function B(input) {
  let scenicScore = 0;
  for (let y = 1; y < input.length - 1; y++) {
    for (let x = 1; x < input.length - 1; x++) {
      const tree = input[y][x];
      const [up, right, down, left] = getDirections(x, y, input);
      const upScore = getScenicScore(tree, up);
      const rightScore = getScenicScore(tree, right);
      const downScore = getScenicScore(tree, down);
      const leftScore = getScenicScore(tree, left.reverse());
      const score = upScore * rightScore * downScore * leftScore;
      if (score > scenicScore) {
        scenicScore = score;
      }
    }
  }
  return scenicScore;
}

function getDirections(x, y, input) {
  const up = [];
  const right = [];
  const down = [];
  const left = [];
  for (let yy = y - 1; yy >= 0; yy--) {
    // UP
    up.push(input[yy][x]);
  }
  right.push(...input[y].slice(x + 1));
  for (let yy = y + 1; yy < input.length; yy++) {
    // DOWN
    down.push(input[yy][x]);
  }
  left.push(...input[y].slice(0, x));
  return [up, right, down, left];
}

function isVisible(tree, otherTrees) {
  return otherTrees.filter((t) => t >= tree).length === 0;
}

function getScenicScore(tree, otherTrees) {
  const firstHigherTree = otherTrees.findIndex((t) => t >= tree);
  if (firstHigherTree === -1) {
    return otherTrees.length;
  }
  return firstHigherTree + 1;
}

function parse(input) {
  return input.map((line) => line.split(""));
}

module.exports = { A, B, parse };
