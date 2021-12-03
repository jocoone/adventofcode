const IntCodeRunner = require('../../common/icc');

function A(program) {
  return new IntCodeRunner(program, [], true).run(1);
}

function B(program) {
  return new IntCodeRunner(program).run(2);
}

function parse(input) {
  return input[0].split(',').map(Number);
}

module.exports = {
  A,
  B,
  parse,
};
