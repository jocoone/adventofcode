const { uniq, values } = require('lodash');

function charCount(p) {
  const s = '' + p;
  const result = {};
  s.split('').forEach((c) => {
    if (result[c]) {
      result[c] = result[c] + 1;
    } else {
      result[c] = 1;
    }
  });
  return result;
}

function calculatePasswords(low, high) {
  const lowest = '' + low;
  const highest = '' + high;
  const possiblePasswords = [];
  for (let i = parseInt(lowest[0]); i < parseInt(highest[0]) + 1; i++) {
    for (let j = i; j < 10; j++) {
      for (let k = j; k < 10; k++) {
        for (let l = k; l < 10; l++) {
          for (let m = l; m < 10; m++) {
            for (let n = m; n < 10; n++) {
              const password = '' + i + j + k + l + m + n;
              const highRule = i <= j && j <= k && k <= l && l <= m && m <= n;
              const uniqueChars = uniq(password.split(''));
              const doubleRule = uniqueChars.length < 6;
              if (highRule && doubleRule) {
                const p = parseInt(password);
                if (p < high && p > low) {
                  possiblePasswords.push(password);
                }
              }
            }
          }
        }
      }
    }
  }

  return possiblePasswords;
}

function A(passwords) {
  return passwords.length;
}

function B(passwords) {
  return passwords.map(charCount).filter((c) => values(c).includes(2)).length;
}

function parse() {
  return calculatePasswords(231832, 767346);
}

module.exports = { A, B, parse };
