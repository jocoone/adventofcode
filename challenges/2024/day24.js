function A({ inputs, operations, originalOperations }) {
  const gates = new Map(inputs);
  const ops = [...operations];
  handleOperations2(originalOperations, gates);
  return getBitNumber(gates, "z");
}

function getBitNumber(gates, prefix) {
  return parseInt(Array.from(gates.keys()).filter(key => key.startsWith(prefix)).sort().reverse().map(key => `${gates.get(key)}`).join(""), 2);
}

function handleOperations(operations, gates) {
  while (true) {
    const operationIndex = operations.findIndex(({ gate1, gate2 }) => gates.has(gate1) && gates.has(gate2));
    if (operationIndex >= 0) {
      const operation = operations.splice(operationIndex, 1)[0];
      gates.set(operation.output, operate(gates.get(operation.gate1), gates.get(operation.gate2), operation.operation));
    } else break;
  }
}

function handleOperations2(operations, gates) {
  operations.map(op => {
    //console.log(op);
    for(let key of gates.keys()) {
      op = op.replace(new RegExp(key, 'g'), gates.get(key));
    }
    return op;
  }).forEach(op => {
    const [operation, output] = op.split(" -> ");
    gates.set(output, eval(operation));
  });
}

function operate(gate1, gate2, operation) {
  switch (operation) {
    case "AND":
      return gate1 & gate2;
    case "OR":
      return gate1 | gate2;
    case "XOR":
      return gate1 ^ gate2;
    default:
      throw new Error(`Invalid operation: ${operation}`);
  }
}

function getDependencies(operations) {
  const dependencies = {}; // Object to store input-output relationships
  operations.forEach(({ output, gate1, gate2 }) => dependencies[output] = [gate1, gate2]);
  const outputsStartingWithZ = Object.keys(dependencies).filter((key) => key.startsWith("z"));

  const traceInputs = (output, dependencies, traced) => {
    if (!dependencies[output]) {
      traced.add(output); // Base case: original input
      return;
    }
    dependencies[output].forEach((input) => {
      traceInputs(input, dependencies, traced);
    });
  };

  const allInputs = new Set();
  outputsStartingWithZ.forEach((zOutput) => {
    traceInputs(zOutput, dependencies, allInputs);
  });
  return allInputs;
}

function B({ inputs, operations, originalOperations, involvedKeys }) {
  const rules = [
    ({output, operation}) => output.startsWith('z') && operation !== 'XOR' && output !== 'z45',
    ({output, operation, gate1, gate2}) => !output.startsWith('z') && operation === 'XOR' && !gate1.startsWith('x') && !gate1.startsWith('y') && !gate2.startsWith('x') && !gate2.startsWith('y'),
    ({output, operation}) => operation === 'XOR' && operations.some(({operation: o, gate1, gate2}) => (gate1 === output || gate2 === output) && o === 'OR'),
    ({output, operation, gate1, gate2}) => operation === 'AND' && gate1 !== 'x00' && gate1 !== 'y00' && gate2 !== 'x00' && gate2 !== 'y00' && !operations.some(({operation: o, gate1: g1, gate2: g2}) => (g1 === output || g2 === output) && o === 'OR'),
    ({ operation, gate1, gate2}) => operation === 'OR' && !operations.some(({operation: o,output}) => (gate1 === output || gate2 === output) && o === 'AND'),
  ];
  return operations.filter(operation => rules.some(rule => rule(operation)))
    .map(({output}) => output)
    .sort()
    .join(",");

}


function getOriginalOperations(operations, originalOperations) {
  const involvedKeys = new Set();
  while (true) {
    let changed = false;
    for (let op of operations) {
      const { output, gate1, gate2, operation } = op;
      const foundIndex = originalOperations.findIndex((line) => new RegExp(`${output}.*->`).test(line));
      if (foundIndex >= 0) {
        involvedKeys.add(output);
        let found = originalOperations.splice(foundIndex, 1)[0];
        found = found.replace(output, `(${gate1} ${operation} ${gate2})`);
        originalOperations.push(found);
        changed = true;
      }
    }
    if (!changed) return {
      originalOperations: originalOperations.map(line => line.replaceAll('XOR', '^').replaceAll('AND', '&').replaceAll('OR', '|')),
      involvedKeys
    };
  }
}

function getOperator(operator) {
  switch (operator) {
    case "AND":
      return "&";
    case "OR":
      return "|";
    case "XOR":
      return "^";
    default:
      throw new Error(`Invalid operator: ${operator}`);
  }
}


function Bb({ inputs, operations }) {
  console.log(getDependencies(operations));
  const outputs = operations.map(({ output }) => output);
  for (let four of createUniqueCombinationsOfFourPairs(outputs)) {
    const gates = new Map(inputs);
    const ops = [...operations].map(operation => {
      const foundOne = four.find(([one]) => one === operation.output);
      const foundTwo = four.find(([, two]) => two === operation.output);
      if (foundOne) return { ...operation, output: foundOne[1] };
      if (foundTwo) return { ...operation, output: foundTwo[0] };
      return operation;
    });
    handleOperations(ops, gates);
    if (ops.length === 0) {
      const x = getBitNumber(gates, "x");
      const y = getBitNumber(gates, "y");
      const z = getBitNumber(gates, "z");
      //console.log(x&y);
      if (x & y === z) return four.flatMap(pair => pair).sort().join(",");
    }
  }
}


function* createUniqueCombinationsOfFourPairs(strings) {
  // Helper function to create all unique pairs
  function generateUniquePairs(array) {
    let pairs = [];
    for (let i = 0; i < array.length; i++) {
      for (let j = i + 1; j < array.length; j++) {
        pairs.push([array[i], array[j]]);
      }
    }
    return pairs;
  }

  // Helper function to generate all combinations of size n from an array iteratively
  function* generateCombinations(array, size) {
    let result = [];
    let stack = [];

    stack.push({ index: 0, combination: [] });

    while (stack.length > 0) {
      let { index, combination } = stack.pop();

      if (combination.length === size) {
        yield combination;
        continue;
      }

      for (let i = index; i < array.length; i++) {
        stack.push({ index: i + 1, combination: [...combination, array[i]] });
      }
    }
  }

  // Generate all unique pairs
  const uniquePairs = generateUniquePairs(strings);

  yield* generateCombinations(uniquePairs, 4);
}

function parse(input) {
  const inputs = new Map();
  const operations = [];
  const og = [];
  let gates = false;
  for (let line of input) {
    if (!line) {
      gates = true;
      continue;
    }
    if (!gates) {
      const [key, value] = line.split(": ");
      inputs.set(key, +value);
    } else {
      og.push(line);
      const [gate1, operation, gate2, , output] = line.split(" ");
      operations.push({ gate1, operation, gate2, output });
    }
  }
  const { originalOperations, involvedKeys } = getOriginalOperations(operations, og);
  return { inputs, operations, originalOperations, involvedKeys };
}

module.exports = { A, B, parse };