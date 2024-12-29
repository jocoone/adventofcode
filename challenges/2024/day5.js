function A({ orderRules, pages }) {
  return pages
    .filter(page => isCorrect(page, orderRules))
    .map(page => page[Math.floor(page.length / 2)])
    .reduce((acc, curr) => acc + curr, 0);
}

function B({ orderRules, pages }) {
  const wrongPages = pages.filter(page => !isCorrect(page, orderRules));
  return wrongPages
    .map(page =>
      page.sort((a, b) => {
        const rule = orderRules.find(([num1, num2]) => (a === num1 && b === num2) || (a === num2 && b === num1));
        return rule ? (a === rule[0] ? -1 : 1) : 0;
      }))
    .map(page => page[Math.floor(page.length / 2)])
    .reduce((acc, curr) => acc + curr, 0);
}

function isCorrect(page, orderRules) {
  return orderRules.every(([num1, num2]) => page.indexOf(num1) === -1 || page.indexOf(num2) === -1 ? true : page.indexOf(num1) < page.indexOf(num2));
}

function parse(input) {
  const orderRules = input.slice(0, input.indexOf("")).map(rule => rule.split("|").map(num => +num));
  const pages = input.slice(input.indexOf("") + 1).map(row => row.split(",").map(num => +num));
  return { orderRules, pages };
}

module.exports = { A, B, parse };