const { memoize } = require("lodash");

const permutations = getPermutations([
  'LEFT',
  'UP',
  'RIGHT',
  'DOWN'
]);

const NUM_PAD = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  ["x", "0", "A"]
];

const DIR_PAD = [
  ["x", "UP", "A"],
  ["LEFT", "DOWN", "RIGHT"]
];

class Robot {
  constructor(pad, level) {
    this.pad = pad;
    this.location = 'A';
    this.level = level;
  }

  getPath(keys, directions) {
    const path = [];
    for (let i = 0; i < keys.length; i++) {
      path.push(...findPath(this.pad, this.location, keys[i], directions, this.level), 'A');
      this.location = keys[i];
    }
    return path;
  }
}

function A(codes) {
  return getKeysToPush(codes, 2);
}

function calculateKeys(code, directions, robots) {
  const numpadKeys = new Robot(NUM_PAD, -1).getPath(code, directions);
  let robotKeys = new Robot(DIR_PAD, 0).getPath(numpadKeys, directions);
  for (let i = 0; i < robots - 1; i++) {
    console.log(i);
    robotKeys = new Robot(DIR_PAD, i + 1).getPath(robotKeys, directions);
  }
  return robotKeys.length;
}

const DIR = {
   "DOWN": [0, 1],
  "UP": [0, -1],
  "RIGHT": [1, 0],
  "LEFT": [-1, 0],
};

const findPath = memoize((pad, start, end, directions, level) => {
  return findShortestPath(
    pad,
    getPadLocation(pad, start),
    getPadLocation(pad, end),
    directions
  );
}, (pad, start, end, directions, level) => `${start},${end},${directions},${level}`);

function getPadLocation(pad, key = "A") {
  for (let y = 0; y < pad.length; y++) {
    for (let x = 0; x < pad[y].length; x++) {
      if (pad[y][x] === key) {
        return [x, y];
      }
    }
  }
}

function getKeysToPush(codes, robots) {
  return codes
    .map((code) => {
      const k = permutations.map((perm) => calculateKeys(code, perm, robots));
      const numberOfKeys = Math.min(...k);
      return numberOfKeys * +code.replace("A", "").replace(/^0*/, "");
    })
    .reduce((acc, curr) => acc + curr, 0);
}

function B(codes) {
  return solver(codes, 25);
}

const solver = (commands, numRobots) => {
  // The sum of all complexities
  let total = 0;
  // Process each command separately
  for(let command of commands){
    // Get the numeric part of the command
    let commandNum = parseInt(command.split('A')[0]);
    // Process the number command into the set of possible arrow commands
    let arrowsCommands = processNumberCommand(command);
    // Track the shortest length to complete each one
    let shortLength = Infinity;
    // Process each possible option
    for(let arrowCommand of arrowsCommands){
      // Find the shortest length of the sequence
      let temp = findShortestSequence(arrowCommand, numRobots);
      // Save this if less that a previously found shortest value
      if(temp < shortLength)
        shortLength = temp
    }
    // Calculate complexity and add it to the total
    total += shortLength * commandNum;
  }
  return total;
}

const findShortestSequence = memoize((command, numRobots, keypad = 0) =>{
  // If this keypad is at the number of robots then return the length of the current command value
  if(keypad === numRobots){
    return command.length;
  }

  // Get the next available arrow command
  let nextCommand = processArrowCommand(command);
  // Split the command into each original characters sequence
  let commandSplits = nextCommand.split('A')
    .filter((command, index, array) => index != array.length-1)
    .map(c => c + 'A');
  // Find the shortest for each character's sequence and total them
  let shortest = 0;
  for(let splitCommand of commandSplits){
    shortest += findShortestSequence(splitCommand, numRobots, keypad+1);
  }

  return shortest;
}, (command, numRobots, keypad) => `${command},${numRobots},${keypad}`);

const processArrowCommand = (command) => {
  // Always start at A
  let current = 'A';
  // Store the output
  let output = '';
  // Produce the result for each button in the command one at a time
  for(let button of command){
    // Get the action sequence for this command, add it to the output,
    // and set the current button to the one just processed.
    // Only take the first action returned since if there are more
    // than one action sequence for a button change they are equivalent.
    let actions = arrowMovements.get(current).find((move) => move.button === button).actions[0];
    output += actions;
    current = button;
  }
  return output;
};

const processNumberCommand = (command) => {
  // Always start at A
  let current = 'A';
  // Store the outputs of al possible sequences
  let outputs = [''];
  // Produce the result for each button in the command one at a time
  for(let button of command){
    // Get the possible action sequences for this command
    let actions = numericMovements.get(current).find((move) => move.button === button).actions;
    // Store new outputs
    let newOutputs = [];
    // Append each possible action sequence to each already found output and store them into new outputs
    for(let output of outputs){
      for(let action of actions){
        newOutputs.push(output + action);
      }
    }
    // Assign new outputs to outputs and set the current button to the one that was just processed
    outputs = newOutputs;
    current = button;
  }
  return outputs;
}

function findShortestPath(pad, start, end, directions) {
  const rows = pad.length;
  const cols = pad[0].length;
  const queue = [[start[0], start[1], 0, []]]; // [row, col, distance]
  const visited = new Set();
  visited.add(`${start[0]},${start[1]}`);
  let lowestDistance = Infinity;
  let result;
  while (queue.length > 0) {
    const [x, y, dist, path] = queue.shift();

    // If the current position is the end position, return the distance
    if (x === end[0] && y === end[1]) {
      if (dist < lowestDistance) {
        lowestDistance = dist;
        result = path;
      }
    }

    // Explore all possible DIRECTIONS
    for (const direction of directions) {
      const [dr, dc] = DIR[direction];
      const newX = x + dr;
      const newY = y + dc;

      if (
        newY >= 0 && newY < rows &&
        newX >= 0 && newX < cols &&
        pad[newY][newX] !== "x" &&
        !visited.has(`${newX},${newY}`)
      ) {
        queue.push([newX, newY, path.length + 1, [...path, getDirection(dr, dc)]]);
        visited.add(`${newX},${newY}`);
      }


    }
  }

  // If no path is found, return -1
  return result;
}

function getDirection(dx, dy) {
  if (dx === 0) {
    return dy > 0 ? "DOWN" : "UP";
  }
  return dx > 0 ? "RIGHT" : "LEFT";
}

function getPermutations(arr) {
  const results = [];

  function permute(subArr, current = []) {
    if (subArr.length === 0) {
      results.push(current);
      return;
    }

    for (let i = 0; i < subArr.length; i++) {
      const remaining = subArr.slice(0, i).concat(subArr.slice(i + 1));
      permute(remaining, current.concat(subArr[i]));
    }
  }

  permute(arr);
  return results;
}

function parse(input) {
  return input;
}

const numericMovements = new Map([
  ['A', [
    {button: 'A', actions: ['A']},
    {button: '0', actions: ['<A']},
    {button: '1', actions: ['^<<A']},
    {button: '2', actions: ['<^A', '^<A']},
    {button: '3', actions: ['^A']},
    {button: '4', actions: ['^^<<A']},
    {button: '5', actions: ['<^^A', '^^<A']},
    {button: '6', actions: ['^^A']},
    {button: '7', actions: ['^^^<<A']},
    {button: '8', actions: ['<^^^A', '^^^<A']},
    {button: '9', actions: ['^^^A']},
  ]],
  ['0', [
    {button: 'A', actions: ['>A']},
    {button: '0', actions: ['A']},
    {button: '1', actions: ['^<A']},
    {button: '2', actions: ['^A']},
    {button: '3', actions: ['^>A', '>^A']},
    {button: '4', actions: ['^^<A', '^<^A']},
    {button: '5', actions: ['^^A']},
    {button: '6', actions: ['^^>A', '>^^A']},
    {button: '7', actions: ['^^^<A']},
    {button: '8', actions: ['^^^A']},
    {button: '9', actions: ['^^^>A', '>^^^A']},
  ]],
  ['1', [
    {button: 'A', actions: ['>>vA']},
    {button: '0', actions: ['>vA']},
    {button: '1', actions: ['A']},
    {button: '2', actions: ['>A']},
    {button: '3', actions: ['>>A']},
    {button: '4', actions: ['^A']},
    {button: '5', actions: ['^>A', '>^A']},
    {button: '6', actions: ['^>>A', '>>^A']},
    {button: '7', actions: ['^^A']},
    {button: '8', actions: ['^^>A', '>^^A']},
    {button: '9', actions: ['^^>>A', '>>^^A']},
  ]],
  ['2', [
    {button: 'A', actions: ['>vA', 'v>A']},
    {button: '0', actions: ['vA']},
    {button: '1', actions: ['<A']},
    {button: '2', actions: ['A']},
    {button: '3', actions: ['>A']},
    {button: '4', actions: ['^<A', '<^A']},
    {button: '5', actions: ['^A']},
    {button: '6', actions: ['^>A', '>^A']},
    {button: '7', actions: ['^^<A', '<^^A']},
    {button: '8', actions: ['^^A']},
    {button: '9', actions: ['^^>A', '>^^A']},
  ]],
  ['3', [
    {button: 'A', actions: ['vA']},
    {button: '0', actions: ['v<A', '<vA']},
    {button: '1', actions: ['<<A']},
    {button: '2', actions: ['<A']},
    {button: '3', actions: ['A']},
    {button: '4', actions: ['^<<A', '<<^A']},
    {button: '5', actions: ['^<A', '<^A']},
    {button: '6', actions: ['^A']},
    {button: '7', actions: ['<<^^A', '^^<<A']},
    {button: '8', actions: ['^^<A', '<^^A']},
    {button: '9', actions: ['^^A']},
  ]],
  ['4', [
    {button: 'A', actions: ['>>vvA']},
    {button: '0', actions: ['>vvA']},
    {button: '1', actions: ['vA']},
    {button: '2', actions: ['v>A', '>vA']},
    {button: '3', actions: ['v>>A', '>>vA']},
    {button: '4', actions: ['A']},
    {button: '5', actions: ['>A']},
    {button: '6', actions: ['>>A']},
    {button: '7', actions: ['^A']},
    {button: '8', actions: ['^>A', '>^A']},
    {button: '9', actions: ['>>^A', '^>>A']},
  ]],
  ['5', [
    {button: 'A', actions: ['>vvA', 'vv>A']},
    {button: '0', actions: ['vvA']},
    {button: '1', actions: ['v<A', '<vA']},
    {button: '2', actions: ['vA']},
    {button: '3', actions: ['v>A', '>vA']},
    {button: '4', actions: ['<A']},
    {button: '5', actions: ['A']},
    {button: '6', actions: ['>A']},
    {button: '7', actions: ['^<A', '<^A']},
    {button: '8', actions: ['^A']},
    {button: '9', actions: ['>^A', '^>A']},
  ]],
  ['6',[
    {button: 'A', actions: ['vvA']},
    {button: '0', actions: ['vv<A', '<vvA']},
    {button: '1', actions: ['v<<A', '<<vA']},
    {button: '2', actions: ['v<A', '<vA']},
    {button: '3', actions: ['vA']},
    {button: '4', actions: ['<<A']},
    {button: '5', actions: ['<A']},
    {button: '6', actions: ['A']},
    {button: '7', actions: ['^<<A', '<<^A']},
    {button: '8', actions: ['^<A', '<^A']},
    {button: '9', actions: ['^A']},
  ]],
  ['7', [
    {button: 'A', actions: ['>>vvvA']},
    {button: '0', actions: ['>vvvA']},
    {button: '1', actions: ['vvA']},
    {button: '2', actions: ['vv>A', '>vvA']},
    {button: '3', actions: ['vv>>A', '>>vvA']},
    {button: '4', actions: ['vA']},
    {button: '5', actions: ['v>A', '>vA']},
    {button: '6', actions: ['v>>A', '>>vA']},
    {button: '7', actions: ['A']},
    {button: '8', actions: ['>A']},
    {button: '9', actions: ['>>A']},
  ]],
  ['8', [
    {button: 'A', actions: ['>vvvA', 'vvv>A']},
    {button: '0', actions: ['vvvA']},
    {button: '1', actions: ['vv<A', '<vvA']},
    {button: '2', actions: ['vvA']},
    {button: '3', actions: ['vv>A', '>vvA']},
    {button: '4', actions: ['v<A', '<vA']},
    {button: '5', actions: ['vA']},
    {button: '6', actions: ['v>A', '>vA']},
    {button: '7', actions: ['<A']},
    {button: '8', actions: ['A']},
    {button: '9', actions: ['>A']},
  ]],
  ['9', [
    {button: 'A', actions: ['vvvA']},
    {button: '0', actions: ['vvv<A', '<vvvA']},
    {button: '1', actions: ['vv<<A', '<<vvA']},
    {button: '2', actions: ['vv<A', '<vvA']},
    {button: '3', actions: ['vvA']},
    {button: '4', actions: ['v<<A', '<<vA']},
    {button: '5', actions: ['v<A', '<vA']},
    {button: '6', actions: ['vA']},
    {button: '7', actions: ['<<A']},
    {button: '8', actions: ['<A']},
    {button: '9', actions: ['A']},
  ]],
]);

/**
 * A map of the best possible moves from any button to any other button on an arrow pad.
 * This map uses only action sequences that require only one change in direction at most
 * since that is always most efficient.
 */
let arrowMovements = new Map([
  ['A', [
    {button: 'A', actions: ['A']},
    {button: '^', actions: ['<A']},
    {button: 'v', actions: ['<vA', 'v<A']},
    {button: '<', actions: ['v<<A', '<v<A']},
    {button: '>', actions: ['vA']},
  ]],
  ['^', [
    {button: 'A', actions: ['>A']},
    {button: '^', actions: ['A']},
    {button: 'v', actions: ['vA']},
    {button: '<', actions: ['v<A']},
    {button: '>', actions: ['v>A', '>vA']},
  ]],
  ['v', [
    {button: 'A', actions: ['^>A', '>^A']},
    {button: '^', actions: ['^A']},
    {button: 'v', actions: ['A']},
    {button: '<', actions: ['<A']},
    {button: '>', actions: ['>A']},
  ]],
  ['<', [
    {button: 'A', actions: ['>>^A', '>^>A']},
    {button: '^', actions: ['>^A']},
    {button: 'v', actions: ['>A']},
    {button: '<', actions: ['A']},
    {button: '>', actions: ['>>A']},
  ]],
  ['>', [
    {button: 'A', actions: ['^A']},
    {button: '^', actions: ['<^A', '^<A']},
    {button: 'v', actions: ['<A']},
    {button: '<', actions: ['<<A']},
    {button: '>', actions: ['A']},
  ]],
]);

module.exports = { A, B, parse };