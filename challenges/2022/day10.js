const { findLetter } = require("../../utils/util");
const { CommunicationDevice } = require("./common/communication-device");

function A(communicationDevice) {
  return communicationDevice.signalStrength;
}

function B(communicationDevice) {
  //communicationDevice.printScreen();
  return communicationDevice.getScreen();
}

function parseCRT(CRT) {
  const letters = [];
  for (let i = 0; i < 8; i++) {
    const letterCharacters = CRT.map((line) =>
      line.slice(i * 5, i * 5 + 4)
    ).join("");
    letters.push(findLetter(letterCharacters, "#"));
  }
  console.log(CRT);
  return letters.join("");
}

function parse(input) {
  return new CommunicationDevice().readInstructions(input);
}

module.exports = { A, B, parse };
