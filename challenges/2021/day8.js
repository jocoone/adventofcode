const { sortBy, xor } = require("lodash");

function A(input) {
  return input.map(({output}) => {
    return output.map(p => p.length).filter(p => p === 2 || p === 3 || p === 4 || p === 7).length;
  })
  .reduce((prev, x) => prev + x, 0);
}

function B(input) {
  return input.map(({output, patterns}) => output
      .map(digit => sortBy(digit.split('')).join(''))
      .map(digit => patterns.find(p => p.value === digit).signal)
      .reduce((prev, x) => prev + x, ''))
    .map(Number)
    .reduce((prev, x) => prev + x, 0);
}

function determineSignal(value, patterns) {
  if (value.length === 2) {
    return 1;
  } else if (value.length === 3) {
    return 7;
  } else if (value.length === 4) {
    return 4;
  } else if (value.length === 7) {
    return 8;
  }
  const one = sortBy(patterns.find(x => x.length === 2).split(''));
  const four = sortBy(patterns.find(x => x.length === 4).split(''));
  const eight = sortBy(patterns.find(x => x.length === 7).split(''));

  const sortedValue = sortBy(value.split(''));
  if (value.length === 6) {
    const notUsedSegment = xor(sortedValue, eight)[0];
    if (one.includes(notUsedSegment)) {
      return 6;
    } else if (four.includes(notUsedSegment)) {
      return 0;
    }
    return 9;
  }
  if (value.length === 5) {
    const notUsedSegments = xor(sortedValue, eight);
    if (!one.includes(notUsedSegments[0]) && !one.includes(notUsedSegments[1])) {
      return 3;
    }
    const differenceOneFour = xor(one, four);
    if (sortedValue.includes(differenceOneFour[0]) && sortedValue.includes(differenceOneFour[1])) {
      return 5;
    }
    return 2;
  }
}

function parse(input) {
  return input.map(line => {
    const split = line.split(' | ');
    return {
      patterns: split[0].split(' ').map(value => ({
        value: sortBy(value.split('')).join(''),
        signal: determineSignal(value, split[0].split(' '))
      })),
      output: split[1].split(' ')
    }
  })
}

module.exports = { A, B, parse };
