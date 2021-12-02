const UP = 'up';
const DOWN = 'down';
const FORWARD = 'forward';

class Instruction {
  constructor(direction, amount) {
    this.direction = direction;
    this.amount = amount;
  }

  static parse(input) {
    const split = input.split(' ');
    return new Instruction(split[0], Number(split[1]));
  }
}

class Submarine {
  constructor(instructions) {
    this.x = 0;
    this.y = 0;
    this.aim = 0;
    this.instructions = instructions;
  }

  perform() {
    this.instructions.forEach(({ direction, amount }) => {
      switch (direction) {
        case FORWARD:
          this.x += amount;
          this.y += amount * this.aim;
          break;
        case DOWN:
          this.aim += amount;
          break;
        case UP:
          this.aim -= amount;
      }
    });
  }

  forward() {}

  down() {}

  up() {}
}

module.exports = { Instruction, Submarine };
