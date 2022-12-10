const { FileSystem } = require("./file-system");
const { Terminal } = require("./terminal");
const { Screen } = require("./screen");

class CommunicationDevice {
  constructor() {
    this.fileSystem = new FileSystem();
    this.terminal = new Terminal(this.fileSystem);
    this.screen = new Screen();
    this.signalStrength = 0;
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

  readInstructions(input) {
    let register = 1;
    let cycle = 0;

    const instructions = input.map(this._getInstruction.bind(this));
    this.instructions = instructions;
    instructions.forEach(({ action, value }) => {
      const { result, ticks } = action(value, register);
      for (let i = 0; i < ticks; i++) {
        const row = Math.floor(cycle / 40);
        const x = (cycle % 40) + 1;
        if (cycle + 1 === 20 || (cycle + 1 + 20) % 40 === 0) {
          this.signalStrength += (cycle + 1) * register;
        }
        if (row < 6 && register > -2) {
          const active =
            register === x || register + 1 === x || register + 2 === x;
          this.screen.addToRow(row, active);
        }
        cycle++;
      }
      register = result;
    });
    return this;
  }

  printScreen() {
    this.screen.printCRT();
  }

  getScreen() {
    return this.screen.getCRT();
  }

  _addX(x, register) {
    return {
      result: x + register,
      ticks: 2,
    };
  }

  _noop(_, register) {
    return {
      result: register,
      ticks: 1,
    };
  }

  _getInstruction(instructionLine) {
    const [instruction, v] = instructionLine.split(" ");
    let action;
    let value;
    switch (instruction) {
      case "addx":
        action = this._addX;
        value = +v;
        break;
      default:
        action = this._noop;
    }
    return {
      action,
      value,
    };
  }
}

module.exports = { CommunicationDevice };
