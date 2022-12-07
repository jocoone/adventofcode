const { CommunicationDevice } = require("./common/communication-device");

const communicationDevice = new CommunicationDevice();

function A(buffer) {
  return communicationDevice.findPacket(buffer, 4);
}

function B(buffer) {
  return communicationDevice.findPacket(buffer, 14);
}

function parse([firstLine]) {
  return firstLine;
}

module.exports = { A, B, parse };
