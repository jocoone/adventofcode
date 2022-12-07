const { CommunicationDevice } = require("./common/communication-device");

const totalCapacity = 70000000;
const neededSpace = 30000000;

function A(folders) {
  return folders
    .filter((f) => f.size <= 100000)
    .map((f) => f.size)
    .reduce((prev, curr) => prev + curr, 0);
}

function B(folders) {
  return Math.min(
    ...folders
      .map(({ size }) => size)
      .filter((size) => size > neededSpace - (totalCapacity - folders[0].size))
  );
}

function parse(commands) {
  const communicationDevice = new CommunicationDevice();

  communicationDevice.analyzeFileSystem(commands);
  return communicationDevice.getFiles().filter((f) => f.dir);
}

module.exports = { A, B, parse };
