class Terminal {
  constructor(fileSystem) {
    this.fileSystem = fileSystem;
  }

  perform(command) {
    const [method, ...parameters] = command.split(" ");

    switch (method) {
      case "cd":
        this.fileSystem.changeDirectory(parameters[0]);
        break;
      case "ls":
      default:
        return;
    }
  }

  updateFileSystem(terminalLine) {
    if (terminalLine.startsWith("dir")) {
      this.fileSystem.addDirectory(terminalLine.replace("dir ", ""));
    } else {
      const s = terminalLine.split(" ");
      this.fileSystem.addFile(s[1], Number(s[0]));
    }
  }
}

module.exports = { Terminal };
