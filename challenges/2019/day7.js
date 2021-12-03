const IntCodeRunner = require('../../common/icc');
const { uniq } = require('lodash');

function A(program) {
  const settings = getPhaseSettings(false);
  let result = 0;
  settings.forEach((setting) => {
    const a = new IntCodeRunner(program, [setting[0]]).run(0);
    const b = new IntCodeRunner(program, [setting[1]]).run(a);
    const c = new IntCodeRunner(program, [setting[2]]).run(b);
    const d = new IntCodeRunner(program, [setting[3]]).run(c);
    const e = new IntCodeRunner(program, [setting[4]]).run(d);
    if (e > result) {
      result = e;
    }
  });
  return result;
}

function B(program) {
  const settings = getPhaseSettings(true);
  const thrusterSignals = [];
  settings.forEach((setting) => {
    const amplifiers = setting.map((s) => new IntCodeRunner([...program], [s]));

    let index = 0;
    let lastOutput = 0;

    while (!amplifiers[4].terminated) {
      const output = amplifiers[index].run(lastOutput);

      if (output !== null) {
        lastOutput = output;
      }

      index = index + 1 === amplifiers.length ? 0 : index + 1;
    }

    thrusterSignals.push(Number(lastOutput));
  });
  return thrusterSignals.sort((a, b) => b - a)[0];
}

function getPhaseSettings(loopmode) {
  const result = [];
  const start = loopmode ? 5 : 0;
  for (let i = start; i < start + 5; i++) {
    for (let j = start; j < start + 5; j++) {
      for (let k = start; k < start + 5; k++) {
        for (let l = start; l < start + 5; l++) {
          for (let m = start; m < start + 5; m++) {
            if (uniq([i, j, k, l, m]).length === 5) {
              result.push([i, j, k, l, m]);
            }
          }
        }
      }
    }
  }
  return result;
}

function parse(input) {
  return input[0].split(',').map(Number);
}

module.exports = {
  A,
  B,
  parse,
};
