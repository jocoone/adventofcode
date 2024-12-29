function A(input) {
  return input
    .filter(num => typeof num === 'number')
    .reduce((acc, curr) => acc + curr, 0);
}

function B(input) {
  let take = true;
  return input
    .reduce((acc, curr) => {
      if (take) {
        if (typeof curr === 'number') {
          return acc + curr;
        } else {
          take = !curr.includes('don\'t');
        }
      }
      return acc;
    })
}

function parse(input) {
  return [...input.join("").matchAll(/(mul\(\d{1,3},\d{1,3}\))|(do\(\))|(don't\(\))/g)]
    .map(([mul]) => mul.includes("mul") ?  mul.split(",") : [mul])
    .map(([num1, num2]) => num2 ? +num1.replace("mul(", "") * +num2.replace(")", "") : num1);
}

module.exports = { A, B, parse };