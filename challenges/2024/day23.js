function A({ networkMap, computers }) {
  let count = 0;
  const sets = combineStringsToSets(computers, networkMap,3);
  for (let combination of sets) {
    if (combination.every(pc => combination.every(otherPc => pc === otherPc || networkMap.get(pc).has(otherPc)))) {
      const [pc1, pc2, pc3] = combination;
      if (pc1.startsWith("t") || pc2.startsWith("t") || pc3.startsWith("t")) count++;
    }
  }
  return count;
}

function B({ networkMap, computers }) {
  /*const sizes = Array.from(networkMap.values()).map(x => x.size);
  for (let i = Math.max(...sizes); i >= 0; i--) {
    console.log(i);
    for (let combination of combineStringsToSets(computers, networkMap, i)) {
      if (combination.every(pc => combination.every(otherPc => pc === otherPc || networkMap.get(pc).has(otherPc)))) {
        return combination.sort().join(',')
      }
    }
  }*/
  return [...networkMap.keys()]
    .map(node =>
      [...networkMap.get(node)]
        .flatMap(next => [
          node,
          ...[...networkMap.get(next)]
            .filter(nextnext =>
              networkMap.get(nextnext).has(node)
            ),
        ])
        .filter(
          (node, i, arr) =>
            arr.indexOf(node) === i &&
            arr.every(
              other =>
                other === node ||
                networkMap.get(other).has(node)
            )
        )
    )
    .reduce((max, network) =>
      max.length > network.length ? max : network
    )
    .sort()
    .join(",");
}

function *combineStringsToSets(strings, networkMap, setSize) {
  // Optimized to handle large datasets using iterative approach instead of recursion
  const stack = [];

  stack.push({ start: 0, combination: [] });

  while (stack.length > 0) {
    const { start, combination } = stack.pop();

    if (combination.length === setSize) {
      yield combination;
      continue;
    }

    for (let i = start; i <= strings.length - (setSize - combination.length); i++) {
      stack.push({
        start: i + 1,
        combination: [...combination, strings[i]]
      });
    }
  }
}

function parse(connections) {
  const networkMap = new Map();
  connections.forEach(connection => {
    const [pc1, pc2] = connection.split("-");
    if (!networkMap.has(pc1)) networkMap.set(pc1, new Set([pc2]));
    else networkMap.get(pc1).add(pc2);
    if (!networkMap.has(pc2)) networkMap.set(pc2, new Set([pc1]));
    else networkMap.get(pc2).add(pc1);
  });
  return { networkMap, computers: Array.from(networkMap.keys()) };
}

module.exports = { A, B, parse };