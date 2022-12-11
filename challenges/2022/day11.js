function A(monkeys) {
  return getMostActiveMonkeysLevel(monkeys, 20, 3);
}

function B(monkeys) {
  monkeys.forEach((monkey) => {
    monkey.items = [...monkey.originalItems];
    monkey.tests = 0;
  });
  return getMostActiveMonkeysLevel(monkeys, 10000, 1);
}

function getMostActiveMonkeysLevel(monkeys, rounds, division) {
  const overflow = monkeys
    .map((m) => m.testNumber)
    .reduce((prev, curr) => prev * curr, 1);

  for (let round = 0; round < rounds; round++) {
    monkeys.forEach((monkey) => {
      const numberOfItems = monkey.items.length;
      for (let i = 0; i < numberOfItems; i++) {
        const item = monkey.items.shift();
        const newItem =
          Math.floor(monkey.operation(item) / division) % overflow;
        const result = monkey.test(newItem);
        const monkeyToThrow = result ? monkey.ifTrue : monkey.ifFalse;
        monkeys[monkeyToThrow].receive(newItem);
      }
    });
  }

  const [m1, m2] = [...monkeys].sort((m1, m2) => m2.tests - m1.tests);
  return m1.tests * m2.tests;
}

function parse(input) {
  const monkeys = [];
  for (let i = 0; i < input.length; i += 7) {
    const startingItems = input[i + 1]
      .split(": ")[1]
      .split(", ")
      .map((x) => +x);
    const operation = getOperation(input[i + 2].split("new = ")[1]);
    const test = +input[i + 3].split("by ")[1];
    const t = input[i + 4].split("monkey ")[1];
    const f = input[i + 5].split("monkey ")[1];
    const monkey = new Monkey(startingItems, operation, test, t, f);
    monkeys.push(monkey);
  }
  return monkeys;
}

function getOperation(operation) {
  const plus = operation.includes("+");
  if (plus) {
    const [x1, x2] = operation.split(" + ");
    return (item) => {
      const f1 = x1 === "old" ? item : +x1;
      const f2 = x2 === "old" ? item : +x2;
      return f1 + f2;
    };
  } else {
    const [x1, x2] = operation.split(" * ");
    return (item) => {
      const f1 = x1 === "old" ? item : +x1;
      const f2 = x2 === "old" ? item : +x2;
      return f1 * f2;
    };
  }
}

class Monkey {
  constructor(items, operation, test, t, f) {
    this.originalItems = [...items];
    this.items = items;
    this.operation = operation;
    this.testNumber = test;
    this.ifTrue = t;
    this.ifFalse = f;
    this.tests = 0;
  }

  test(item) {
    this.tests++;
    return item % this.testNumber === 0;
  }

  receive(item) {
    this.items.push(item);
  }
}

module.exports = { A, B, parse };
