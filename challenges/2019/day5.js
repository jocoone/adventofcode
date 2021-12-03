const IntCodeRunner = require('../../common/icc');

function A(program) {
  const result = new IntCodeRunner(program, [], false).run(1);
  return result[result.length - 1];
}

function B(program) {
  return new IntCodeRunner(program, []).run(5);
}

function parse(input) {
  return input[0].split(',').map(Number);
}

module.exports = { A, B, parse };
