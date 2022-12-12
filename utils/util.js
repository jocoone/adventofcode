const maxBy = (cb) => (a, b) => cb(b) > cb(a) ? b : a;

const minBy = (cb) => (a, b) => cb(b) < cb(a) ? b : a;

const findRoutes = (graph, source, dest, cbNeighbors) => {
  const allKeys = new Set([source]);
  const nodes = new Set([source]);
  const dist = new Map();
  const prev = new Map();
  let level = 0;

  const getDist = (key) => (dist.has(key) ? dist.get(key) : Infinity);
  dist.set(source, 0);

  while (nodes.size) {
    let closest = [...nodes].reduce(minBy((n) => getDist(n)));
    if (dest && closest === dest && level === 0) {
      return [dist.get(dest), toPath(prev, source, dest)];
    }
    nodes.delete(closest);
    const neighbors = cbNeighbors
      ? cbNeighbors(graph, closest)
      : graph[closest];
    neighbors.forEach((neighbor) => {
      if (!allKeys.has(neighbor)) {
        allKeys.add(neighbor);
        nodes.add(neighbor);
      }
      const alt = getDist(closest) + 1;
      if (alt < getDist(neighbor)) {
        dist.set(neighbor, alt);
        prev.set(neighbor, closest);
      }
    });
  }

  return dest ? [] : [dist, prev];
};

const toPath = (prev, source, dest) => {
  const path = [];
  let current;
  do {
    current = current ? prev.get(current) : dest;
    path.push(current);
  } while (current !== source);
  return path.reverse();
};

const logTime = (ex = "exercise", cb) => {
  console.time(ex);
  const result = cb();
  if (ex.includes("Parse") || ex.includes("Total") || ex.includes("Read")) {
    console.timeLog(ex);
  } else {
    console.timeLog(ex, `➡️ ${JSON.stringify(result)}`);
  }
  return result;
};

function groupLines(lines) {
  const result = [];
  let newGroup = true;
  for (const line of lines) {
    if (line === "") {
      newGroup = true;
    } else {
      if (newGroup) {
        result.push([line]);
        newGroup = false;
      } else {
        result[result.length - 1].push(line);
      }
    }
  }
  return result;
}

function repl(letter, c) {
  const regex = new RegExp(c, "g");
  return letter.replace(regex, "X");
}

const ALPHABET = {
  A: [" XX X  XX  XXXXXX  XX  X"],
  B: ["XXX X  XXXX XXX X  XXXX ", "XXX X  XXXX X  XX  XXXX "],
  C: [" XX X  XX   X   X  X XX "],
  D: ["XXX X  XX  XX  XX  XXXX "],
  E: ["XXXXX   XXX X   X   XXXX"],
  F: ["XXXXX   XXX X   X   X   "],
  G: [" XX X  XX   X XXX  X XXX", repl(" ##    #      ##   # ###", "#")],
  H: ["X  XX  XXXXXX  XX  XX  X"],
  I: [""],
  J: ["XXXX   X   X   X   XXXX "],
  K: ["X  XX X XX  X X X X X  X", repl(" #  #  #   ##  ##  # # #", "#")],
  L: ["X   X   X   X   X   XXXX"],
  M: [""],
  N: [""],
  O: [" XX X  XX  XX  XX  X XX "],
  P: ["XXX X  XXXX X   X   X   "],
  Q: [""],
  R: ["XXX X  XX  XXXX X X X  X", repl(" ### #   #   ### # # # ", "#")],
  S: [" XX X  XXXX    X   XXXX "],
  T: [""],
  U: ["X  XX  XX  XX  XX  X XX "],
  V: [""],
  W: [""],
  X: [""],
  Y: [""],
  Z: ["XXXX   X  X  X  X   XXXX"],
};

function findLetter(letterCharacters, c) {
  return Object.keys(ALPHABET).find(
    (key) =>
      !!ALPHABET[key].find((comb) => comb.replace(/X/g, c) === letterCharacters)
  );
}

module.exports = {
  maxBy,
  minBy,
  findRoutes,
  toPath,
  logTime,
  groupLines,
  ALPHABET,
  findLetter,
};
