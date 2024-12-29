function A(slotMachines) {
  return slotMachines.map(slotMachine => calculatePushes(slotMachine)).reduce((acc, curr) => acc + curr, 0);
}

function B(slotMachines) {
  return slotMachines.map(slotMachine => calculatePushes(slotMachine,10000000000000)).reduce((acc, curr) => acc + curr, 0);
}

function calculatePushes(slotMachine, offset = 0) {
  const divider = slotMachine.a[0] * slotMachine.b[1] - slotMachine.b[0] * slotMachine.a[1];
  
  const equationA = (slotMachine.prize[0] + offset) * slotMachine.b[1] - (slotMachine.prize[1]+ offset) * slotMachine.b[0];
  const equationB = slotMachine.a[0] * (slotMachine.prize[1] + offset) - slotMachine.a[1] * (slotMachine.prize[0] + offset);

  if (equationA % divider !== 0 || equationB % divider !== 0) {
    return 0;
  }

  return equationA / divider * 3 + equationB / divider;
}

function parse(input) {
  const slotMachines = [];
  for (let i = 0; i < input.length; i += 4) {
    const slotMachine = {};
    slotMachine.a = input[i].split(": ")[1].split(", ").map(value => +value.split("+")[1]);
    slotMachine.b = input[i + 1].split(": ")[1].split(", ").map(value => +value.split("+")[1]);
    slotMachine.prize = input[i + 2].split(": ")[1].split(", ").map(value => +value.split("=")[1]);
    slotMachines.push(slotMachine);
  }
  return slotMachines;
}

module.exports = { A, B, parse };