function A(octopus) {
  return calculateFlashes(octopus, 100);
}

function B(octopus) {
  return calculateFlashes(octopus);
}

function calculateFlashes(octopus, steps) {
  let flashes = 0;
  let step = 0;
  while (!steps || step < steps) {
    let flashingOctopus = [];
    octopus = octopus.map((oc) => ({
      energy: oc.energy + 1,
      x: oc.x,
      y: oc.y,
    }));
    do {
      flashingOctopus = octopus.filter((oc) => oc.energy > 9);
      flashes += flashingOctopus.length;
      octopus = octopus.map((oc) => ({
        energy: oc.energy > 9 ? 0 : oc.energy,
        x: oc.x,
        y: oc.y,
      }));
      flashingOctopus.forEach((value) => {
        const adjacentOctopus = octopus.filter((oc) => {
          const xDistance = Math.abs(oc.x - value.x);
          const yDistance = Math.abs(oc.y - value.y);
          return (
            oc.energy != 0 &&
            (xDistance === 1 || xDistance === 0) &&
            (yDistance === 1 || yDistance === 0)
          );
        });
        octopus = octopus.map((oc) => ({
          x: oc.x,
          y: oc.y,
          energy: adjacentOctopus.find((o) => o.x === oc.x && o.y === oc.y)
            ? oc.energy + 1
            : oc.energy,
        }));
      });
    } while (flashingOctopus.length > 0);
    step++;
    if (octopus.filter((oc) => oc.energy === 0).length === octopus.length) {
      return step;
    }
  }
  return flashes;
}

function parse(i) {
  const input = i.map((line) => line.split("").map(Number));
  const octopus = [];
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      octopus.push({
        energy: input[y][x],
        x,
        y,
      });
    }
  }
  return octopus;
}

module.exports = { A, B, parse };
