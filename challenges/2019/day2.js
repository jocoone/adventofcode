function prepareProgram(p, noun, verb) {
  const result = [...p];
  result[1] = noun;
  result[2] = verb;
  return result;
}

function runProgram(p) {
  const result = [...p];
  for (let i = 0; i < result.length; i += 4) {
    const opcode = result[i];

    if (opcode === 99) {
      break;
    }

    const input1 = result[i + 1];
    const input2 = result[i + 2];
    const output = result[i + 3];

    if (opcode === 1) {
      result[output] = result[input1] + result[input2];
    } else if (opcode === 2) {
      result[output] = result[input1] * result[input2];
    }
  }

  return result;
}

function findNoundAndVerb(p, i) {
  while (true) {
    for (let noun = 0; noun < 100; noun++) {
      for (let verb = 0; verb < 100; verb++) {
        const input = prepareProgram([...p], noun, verb);
        const result = runProgram(input);
        if (result[0] === i) {
          return { noun: noun, verb: verb };
        }
      }
    }
  }
}

function A(input) {
  const program = prepareProgram(input, 1, 12);
  const result = runProgram(program);
  return result[0];
}

function B(program) {
  const result = findNoundAndVerb(program, 19690720);
  return 100 * result.noun + result.verb;
}

function parse(input) {
  return input[0].split(',').map(Number);
}

module.exports = { A, B, parse };
