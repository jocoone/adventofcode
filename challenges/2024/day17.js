function A({ program, registers }) {
  return runProgram(program, { ...registers }).join(",");
}

function B({ program, registers }) {
  const queue = [];
  queue.push({ result: '', length: 0});

  while(queue.length) {
    const attempt = queue.shift();
    if (attempt.length === program.length) return parseInt(attempt.result, 2);

    const from = parseInt(attempt.result + '000', 2);
    const to = parseInt(attempt.result + '111', 2);

    for(let A = from; A <= to; A++) {
      const result = runProgram(program, { ...registers, A });
      if (result.join(',') === program.slice((attempt.length + 1) * -1).join(',')) {
        queue.push({ result: A.toString(2), length: attempt.length + 1 });
      }
    }
  }

}

function runProgram(program, registers) {
  let i;
  const out = [];
  for (i = 0; i < program.length; i += 2) {
    const opcode = program[i];
    const operand = program[i + 1];
    operate(opcode, operand, registers);
  }

  function operate(opcode, operand, registers) {
    switch (opcode) {
      case 0:
        //console.log(registers.A.toString(2));
        registers.A = Math.floor(registers.A / Math.pow(2, getComboOperand(operand, registers)));
        //console.log(registers.A.toString(2));
        break;
      case 1:
        registers.B = registers.B ^ operand;
        break;
      case 2:
        registers.B = getComboOperand(operand, registers) % 8;
        break;
      case 3:
        if (registers.A !== 0) {
          i = operand - 2;
        }
        break;
      case 4:
        registers.B = registers.B ^ registers.C;
        break;
      case 5:
        out.push(getComboOperand(operand, registers) & 7);
        break;
      case 6:
        registers.B = Math.floor(registers.A / Math.pow(2, getComboOperand(operand, registers)));
        break;
      case 7:
        registers.C = Math.floor(registers.A / Math.pow(2, getComboOperand(operand, registers)));
        break;
    }
  }

  return out;
}

function getComboOperand(operand, registers) {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return operand;
    case 4:
      return registers.A;
    case 5:
      return registers.B;
    case 6:
      return registers.C;
    default:
      throw new Error(`should not happen for instruction ${operand}`);
  }
}

function parse(input) {
  return {
    registers: {
      A: +input[0].split(": ")[1],
      B: +input[1].split(": ")[1],
      C: +input[2].split(": ")[1],
    }, program: input[4].split(": ")[1].split(",").map(Number),
  };
}

module.exports = { A, B, parse };