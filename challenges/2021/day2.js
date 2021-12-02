const { Submarine, Instruction } = require('./submarine');

function A(submarine) {
  return submarine.x * submarine.aim;
}

function B(submarine) {
  return submarine.x * submarine.y;
}

function parse(input) {
  const instructions = input.map(Instruction.parse);
  const submarine = new Submarine(instructions);
  submarine.perform();
  return submarine;
}

module.exports = { A, B, parse };
