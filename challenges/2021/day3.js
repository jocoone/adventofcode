const { groupBy, countBy } = require('lodash');

function A(input) {
  let gamma = '';
  let epsilon = '';

  input[0].forEach((_, i) => {
    const grouped = groupBy(input.map((row) => row[i]));
    const moreZero = grouped[0].length > grouped[1].length;
    gamma += moreZero ? 0 : 1;
    epsilon += moreZero ? 1 : 0;
  });

  return parseInt(gamma, 2) * parseInt(epsilon, 2);
}

function B(input) {
  let oxygen = [...input];
  let co2 = [...input];
  do {
    for (let i = 0; i < input[0].length; i++) {
      const groupedOxy = countBy(oxygen.map((x) => x[i]));
      const groupedCo2 = countBy(co2.map((x) => x[i]));
      const moreZeroOxy = groupedOxy[0] > groupedOxy[1];
      const moreZeroCo2 = groupedCo2[0] > groupedCo2[1];
      oxygen = oxygen.filter(
        (x) => oxygen.length === 1 || x[i] === (moreZeroOxy ? '0' : '1')
      );
      co2 = co2.filter(
        (x) => co2.length === 1 || x[i] === (moreZeroCo2 ? '1' : '0')
      );
    }
  } while (oxygen.length !== 1 && co2.length !== 1);
  return (
    parseInt(
      oxygen[0].reduce((prev, x) => prev + x, ''),
      2
    ) *
    parseInt(
      co2[0].reduce((prev, x) => prev + x, ''),
      2
    )
  );
}

function parse(input) {
  return input.map((x) => x.split(''));
}

module.exports = { A, B, parse };
