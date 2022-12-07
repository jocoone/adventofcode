const { FileSystem } = require("./file-system");
const { Terminal } = require("./terminal");

class CommunicationDevice {
  constructor() {
    this.fileSystem = new FileSystem();
    this.terminal = new Terminal(this.fileSystem);
  }

  findPacket(buffer, packetSize) {
    for (let i = 1; i < buffer.length; i++) {
      const packet = buffer.slice(i, i + packetSize);
      const duplicateSize = new Set(packet.split("")).size;
      if (duplicateSize === packetSize) {
        return i + packetSize;
      }
    }
  }

  analyzeFileSystem(commands) {
    for (let i = 1; i < commands.length; i++) {
      const line = commands[i];
      if (line.startsWith("$")) {
        const command = line.replace("$ ", "");
        this.terminal.perform(command);
      } else {
        this.terminal.updateFileSystem(line);
      }
    }
  }

  getFiles() {
    return this.fileSystem.getFiles();
  }
}

module.exports = { CommunicationDevice };
