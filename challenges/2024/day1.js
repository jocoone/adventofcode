function A([listOne, listTwo]) {
  return listOne.map((num, i) => Math.abs(num - listTwo[i])).reduce((acc, curr) => acc + curr, 0);
}

function B([listOne, listTwo]) {
  return listOne.map((num) => num * listTwo.filter(x => x === num).length).reduce((acc, curr) => acc + curr, 0);
}

function parse(input) {
  const result = input.map((row) => row.split(" "))
    .map(row => [row[0], row[row.length - 1]])
    .reduce(([listOne, listTwo], [num1, num2]) => {
      listOne.push(+num1);
      listTwo.push(+num2);
      return [listOne, listTwo]
    }, [[], []]);
  return [result[0].sort(), result[1].sort()];
}

module.exports = { A, B, parse };