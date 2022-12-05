const crateRegexp = new RegExp("\\[[A-Z]{1}\\]", "g");

function A({ stacksA, procedures }) {
  procedures.forEach(([move, from, to]) =>
    stacksA[to].unshift(...stacksA[from].splice(0, move).reverse())
  );
  return getTopOfStacks(stacksA);
}

function B({ stacksB, procedures }) {
  procedures.forEach(([move, from, to]) =>
    stacksB[to].unshift(...stacksB[from].splice(0, move))
  );
  return getTopOfStacks(stacksB);
}

function getTopOfStacks(stacks) {
  return stacks.map((stack) => stack[0]).join("");
}

function parse(input) {
  const procedures = [];
  const stacks = [];

  for (let i = 0; i < input.length; i++) {
    const line = input[i];

    let match = crateRegexp.exec(line);
    while (match) {
      const stack = match.index / 4;
      if (!stacks[stack]) {
        stacks[stack] = [];
      }
      stacks[stack].push(match[0][1]);
      match = crateRegexp.exec(line);
    }

    if (line.startsWith("move")) {
      procedures.push(...input.slice(i));
      break;
    }
  }

  return {
    stacksA: stacks.map((ss) => [...ss]),
    stacksB: stacks.map((ss) => [...ss]),
    procedures: procedures.map((procedure) => {
      const [_, m, , f, , t] = procedure.split(" ");
      return [m, f - 1, t - 1];
    }),
  };
}

module.exports = { A, B, parse };
