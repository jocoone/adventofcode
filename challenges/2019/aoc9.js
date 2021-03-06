const { readLines } = require('../utils/readandwrite');
const IntCodeRunner = require('../common/icc');

function part1(file, input = 1, b = true) {
  console.time('aoc9p1');
  const program = readLines(file)[0].split(',').map(Number);
  const result = new IntCodeRunner(program, [], b).run(input);
  console.timeEnd('aoc9p1');
  return result;
}

function part2(file, input = 2) {
  console.time('aoc9p2');
  const program = readLines(file)[0].split(',').map(Number);
  const result = new IntCodeRunner(program, []).run(input);
  console.timeEnd('aoc9p2');
  return result;
}

module.exports = {
  part1, part2
};


