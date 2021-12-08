function A(fishCount) {
  return produceFish(fishCount, 80);
}

function B(fishCount) {
  return produceFish(fishCount, 256 - 80);
}

function produceFish(fishCount, days) {
  for (let day = 0; day < days; day++) {
    const newFish = fishCount[0];
    for (let i = 0; i < fishCount.length - 1; i++) {
      fishCount[i] = fishCount[i + 1];
    }
    fishCount[6] = fishCount[6] + newFish;
    fishCount[8] = newFish;
  }
  return fishCount.reduce((prev, x) => prev + x);
}

function parse(input) {
  const fishes = input[0].split(',').map(Number);
  return [0, 1, 2, 3, 4, 5, 6, 7, 8].map(
    (index) => fishes.filter((x) => x === index).length
  );
}

module.exports = { A, B, parse };
