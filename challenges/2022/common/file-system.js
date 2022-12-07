class FileSystem {
  constructor() {
    this.root = { name: "/", children: [] };
    this.currentFolder = this.root;
  }

  getFiles() {
    return this._getFlatFiles(this.root, []);
  }

  addFile(fileName, size) {
    this.currentFolder.children.push({
      name: fileName,
      size,
      parent: this.currentFolder,
    });
  }

  addDirectory(folderName) {
    this.currentFolder.children.push({
      name: folderName,
      children: [],
      parent: this.currentFolder,
    });
  }

  changeDirectory(directoryName) {
    if (directoryName === "..") {
      this.currentFolder = this.currentFolder.parent;
    } else {
      this.currentFolder = this.currentFolder.children.find(
        (f) => f.name === directoryName
      );
    }
  }

  _getFlatFiles(file, files = []) {
    files.push({
      name: file.name,
      size: this._calculateSize(file),
      dir: !!file.children,
    });
    if (file.children) {
      file.children.forEach((child) => this._getFlatFiles(child, files));
    }
    return files;
  }

  _calculateSize(file) {
    if (file.size) {
      return file.size;
    }
    return file.children.reduce((prev, curr) => {
      const size = this._calculateSize(curr);
      return prev + size;
    }, 0);
  }

  print(folder = this.root, level = 0) {
    const line = `${"  ".repeat(level)}- ${folder.name}`;
    console.log(line);
    if (folder.children) {
      folder.children.forEach((f) => this.print(f, level + 1));
    }
  }
}

module.exports = { FileSystem };
