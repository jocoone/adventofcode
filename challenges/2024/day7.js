function A(input) {
  return searchForOperations(input, ["+", "*"]);
}

function B(input) {
  return searchForOperations(input, ["+", "*", ""]);
}

function searchForOperations(lines, operators) {
  return lines
    .filter(([result, numbers]) => {
      for (let ops of generateOperatorCombinations(numbers.length - 1, operators)) {
        if (result === numbers.slice(1).reduce((acc, num, i) => eval(`${acc}${ops[i]}${num}`), numbers[0])) {
          return true;
        }
      }
    })
    .reduce((acc, [result]) => acc + result, 0);
}

function* generateOperatorCombinations(length, operators) {
  function* backtrack(current) {
    if (current.length === length) {
      yield current;
      return;
    }
    for (const operator of operators) {
      current.push(operator);
      yield* backtrack(current);
      current.pop();
    }
  }

  yield* backtrack([]);
}

function parse(input) {
  return input
    .map(line => line.split(": "))
    .map(split => [+split.splice(0, 1), split[0].split(" ")]);
}

module.exports = { A, B, parse };