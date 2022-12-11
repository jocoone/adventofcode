const { findLetter } = require("../../utils/util");
const { CommunicationDevice } = require("./common/communication-device");

function A(communicationDevice) {
  return communicationDevice.signalStrength;
}

function B(communicationDevice) {
  //communicationDevice.printScreen();
  return communicationDevice.getScreen();
}

function parse(input) {
  return new CommunicationDevice().readInstructions(input);
}

module.exports = { A, B, parse };
