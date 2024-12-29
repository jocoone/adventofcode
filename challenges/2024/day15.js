const { uniqBy } = require("lodash");

function moveRobot(instructions, goods, robot, map) {
  for (let m = 0; m < instructions.length; m++) {
    const move = instructions[m];
    const { x: xChange, y: yChange } = getChange(move);
    let goodInTheWay = getGoodInTheWay(goods, robot.x, robot.y, move);
    if (goodInTheWay) {
      const rest = getRest(map, move, goodInTheWay, goods);
      console.log(rest);
      if (rest[0] === ".") {
        moveBox(goodInTheWay, xChange, yChange);
      } else {
        if (rest.includes(".")) {
          const lengthUntilWall = rest.length;
          for (let i = 1; i < lengthUntilWall; i++) {
            if (rest[i - 1] === ".") break;
            if (!goodInTheWay.right || ["<", ">"].includes(move)) {
              const good = goods.findIndex(({
                                              x,
                                              y,
                                              right,
                                            }) => (x === goodInTheWay.x + xChange * i && y === goodInTheWay.y + yChange * i) || (right && goodInTheWay.right.x === x + xChange * i && right.y === goodInTheWay.y));
              if (good !== -1) {
                if (m === 133) console.log("goodie", i, goods[good]);
                moveBox(goods[good], xChange, yChange);
              } else {
                break;
              }
            } else {
              let goodies = [goodInTheWay, goodInTheWay.right];
              do {
                goodies = uniqBy(goodies
                  .map(g => [g, getGoodInTheWay(goods, g.x, g.y, move)])
                  .flatMap(([g, giw]) => giw ? [giw, giw.x === g.x ? undefined : giw.right] : [])
                  .filter(x => !!x), ({ x, y }) => `${x},${y}`);
                if (goodies.find(({ x: xx, y: yy }) => map[yy + xChange] && map[yy + xChange][xx] === "#")) break;
                goodies.forEach(g => moveBox(g, xChange, yChange));
              } while (goodies.length > 0);
            }
          }
          moveBox(goodInTheWay, xChange, yChange);
        }
      }
      if (rest.includes(".")) {
        robot.x += xChange;
        robot.y += yChange;
      }

    } else {
      if (map[robot.y + yChange][robot.x + xChange] !== "#") {
        robot.x += xChange;
        robot.y += yChange;
      }
    }
    if (m > 99 && m < 200) {
      console.log(m, move);
      console.log(goodInTheWay);

      printMap(map, robot, goods);
    }
  }
  printMap(map, robot, goods);
}

function A({ map, instructions, robot: { x, y }, goods: oldGoods }) {
  const robot = { x, y };
  const goods = oldGoods.map(({ x, y }) => ({ x, y }));
  //printMap(map, robot, goods);
  moveRobot(instructions, goods, robot, map);
  return calculateGPS(goods);
}

function moveBox(good, xChange, yChange) {
  good.x += xChange;
  good.y += yChange;
  if (good.right) {
    good.right.x += xChange;
    good.right.y += yChange;
  }
}

function getGoodInTheWay(goods, x, y, move) {
  const { x: xChange, y: yChange } = getChange(move);
  return goods.find(({
                       x: xx,
                       y: yy,
                       right,
                     }) => (xx === x + xChange && yy === y + yChange) || (right && right.x === x + xChange && right.y === y + yChange));
}

function getRest(map, move, { x, y, right }, goods) {
  let s = "";

  switch (move) {
    case "<":
      for (let i = x - (right ? 2 : 1); i > 0; i -= (right ? 2 : 1)) {
        if (map[y][i] === "#") break;
        const good = goods.find((good) => (good.x === i && good.y === y));
        s += good ? `O` : map[y][i];
      }
      return s;
    case ">":
      for (let i = x + (right ? 2 : 1); i < map[y].length; i += (right ? 2 : 1)) {
        if (map[y][i] === "#") break;
        const good = goods.find((good) => good.x === i && good.y === y);
        s += good ? `O` : map[y][i];
      }
      return s;
    case "^":
      if (!right) {
        for (let i = y - 1; i > 0; i -= 1) {
          if (map[i][x] === "#") break;
          s += goods.find((good) => (good.x === x && good.y === i)) ? "O" : map[i][x];
        }
        return s;
      } else {
        let goodies = [{ x, y }, { x: right.x, y: right.y }];
        const { y: yChange } = getChange(move);
        if (map[y + yChange] && map[y + yChange][x] === "#") return s;
        do {
          goodies = goodies
            .map(g => [g, getGoodInTheWay(goods, g.x, g.y, move)])
            .flatMap(([g, giw]) => giw ? [giw, giw.x === g.x ? undefined : giw.right] : [])
            .filter(x => !!x);
          if (goodies.find(({ x: xx, y: yy }) => map[yy + yChange] && map[yy + yChange][xx] === "#")) break;
          s += goodies.length ? "O" : ".";
        } while (goodies.length > 0);
        return s;
      }
    case "v":
      if (!right) {
        for (let i = y + 1; i < map.length; i += 1) {
          if (map[i][x] === "#") break;
          s += goods.find((good) => (good.x === x && good.y === i)) ? "O" : map[i][x];
        }
      } else {
        let goodies = [{ x, y }, { x: right.x, y: right.y }];
        const { y: yChange } = getChange(move);
        if (map[y + yChange][x] === "#") return s;
        do {
          goodies = goodies
            .map(g => [g, getGoodInTheWay(goods, g.x, g.y, move)])
            .flatMap(([g, giw]) => giw ? [giw, giw.x === g.x ? undefined : giw.right] : [])
            .filter(x => !!x);
          if (goodies.find(({ x: xx, y: yy }) => map[yy + yChange][xx] === "#")) break;
          s += goodies.length ? "O" : ".";
        } while (goodies.length > 0);
        return s;
      }
  }
  return s;
}

function printMap(map, robot, goods) {
  for (let y = 0; y < map.length; y++) {
    let line = "";
    for (let x = 0; x < map[y].length; x++) {
      if (robot.x === x && robot.y === y) {
        line += "@";
      } else {
        let good = goods.find(({ x: goodX, y: goodY }) => goodX === x && goodY === y);
        if (good) {
          if (good.right) {
            line += "[]";
            x++;
          } else {
            line += "O";
          }

        } else {
          if (map[y][x] === "#") line += "#";
          else line += ".";
        }
      }
    }
    console.log(line);
  }
}

function getChange(move) {
  switch (move) {
    case "<":
      return { x: -1, y: 0 };
    case ">":
      return { x: 1, y: 0 };
    case "^":
      return { x: 0, y: -1 };
    case "v":
      return { x: 0, y: 1 };
  }
}

function calculateGPS(goods) {
  return goods.map(({ x, y }) => 100 * y + x).reduce((acc, curr) => acc + curr, 0);
}

function B({ map: oldMap, instructions, robot: { x, y }, goods: oldGoods, input }) {
  /*const map = oldMap.map((line) => line.split("").flatMap(char => [char, char]));
  const robot = { x: x * 2, y };
  const goods = oldGoods.map(({ x, y }) => {
    return ({
      x: x * 2,
      y,
      right: { x: x * 2 + 1, y },
    });
  });
  printMap(map, robot, goods);
  moveRobot(instructions, goods, robot, map);
  return calculateGPS(goods);*/
  return part2(input);
}

const SHOW_FINAL_GRIDS = false;

const part2 = (fileContents) => {
  let data = parseInput(fileContents, true);
  return runSim(data.walls, data.boxes, data.location, data.moves, 'Part 2:', data.height, data.width);
}

const parseInput = (fileContents, part2) => {
  // Create objects for storing all of the important information
  let walls = new Set();
  let boxes = new Map();
  let moves = [];
  let location;
  // Is this parsing in the grid from the input file
  let gridMode = true;
  // The height and width of the grid area
  let height;
  let width = part2 ? fileContents[0].length * 2 : fileContents[0].length;

  // Parse each line
  for(let l = 0; l < fileContents.length; l++){
    // If this is the blank separator line
    if(fileContents[l] === ''){
      // Turn off grid parsing
      gridMode = false;
      // Set height
      height = l;
      // Parse next line
      continue;
    }
    // Get the line contents and split the string into an array of each character
    let line = fileContents[l].split('');
    // Double the line length if using part 2
    let lineLength = part2 ? line.length * 2: line.length;
    // Parse each character in the line
    for(let c = 0; c < lineLength; part2 ? c += 2 : c++){
      // Get the current character depending on line length
      let current = part2 ? line[c/2] : line[c];
      // If in grid mode
      if(gridMode){
        // If the starting location is found set it
        if(current === '@'){
          location = {y: l, x:c};
        }
        // If a wall is found add it to the Set of wall locations
        else if(current === '#'){
          if(part2){
            walls.add(`${l},${c}`);
            walls.add(`${l},${c+1}`);
          }
          else{
            walls.add(`${l},${c}`);
          }
        }
        // If a box is found add it to the Map of box locations
        else if(current === 'O'){
          if(part2){
            boxes.set(`${l},${c}`, {y: l, x:c, symbol: '['});
            boxes.set(`${l},${c+1}`, {y: l, x:c+1, symbol: ']'});
          }
          else{
            boxes.set(`${l},${c}`, {y: l, x:c, symbol: 'O'});
          }
        }
      }
      // If not in grid mode the parse all characters into the array of moves
      else{
        moves.push(current);
      }
    }
  }

  return {walls, boxes, location, moves, height, width};
}

const runSim = (walls, boxes, location, moves, message, height, width) => {
  // Simulate each move one at a time
  for(let m = 0; m < moves.length; m++){
    // Get the direction of movement
    let direction = moves[m];
    // Track any boxes to be moved
    let boxesToMove = [];
    // Flag for if a wall was hit
    let hitWall = false;

    // Track the next positions to check next
    let nextPositions = [];
    // Start with the next position to check based on the direction of travel
    if(direction === '^')
      nextPositions.push({y: location.y-1, x: location.x});
    else if(direction === 'v')
      nextPositions.push({y: location.y+1, x: location.x});
    else if(direction === '<')
      nextPositions.push({y: location.y, x: location.x-1});
    else if(direction === '>')
      nextPositions.push({y: location.y, x: location.x+1});

    // Use Breadth First Search (BFS) to find all boxes to be moved.
    // Stop searching if we hit a wall since that means nothing will move.
    while(nextPositions.length > 0 && !hitWall){
      // Get the next position to check and create it's search key
      let nextPos = nextPositions.shift();
      let nextKey = `${nextPos.y},${nextPos.x}`

      // If this is a wall set the hit wall flag to true
      if(walls.has(nextKey)){
        hitWall = true;
      }
      // Else if it is a box process the next positions to check
      else if(boxes.has(nextKey)){
        // Get the current box
        let current = boxes.get(nextKey);
        // Add it to the array of boxes to move
        boxesToMove.push(current);
        // Remove it from the Map of boxes
        boxes.delete(nextKey);
        // Create the key for the opposite side of the box if this is a 2 wide box
        let oppositeKey;
        if(current.symbol === '[')
          oppositeKey = `${nextPos.y},${nextPos.x+1}`;
        else if(current.symbol === ']')
          oppositeKey = `${nextPos.y},${nextPos.x-1}`;
        // Get the opposite side of the box if it exists
        let opposite;
        if(oppositeKey){
          // Get the opposite side of the box
          opposite = boxes.get(oppositeKey)
          // Add it to the array of boxes to move
          boxesToMove.push(opposite);
          // Remove it from the Map of boxes
          boxes.delete(oppositeKey);
        }

        // If moving up
        if(direction === '^'){
          // Add the space above this to next positions array
          nextPositions.push({y: nextPos.y-1, x: nextPos.x});
          // If there is an opposite side of the box. Add that
          // to the next positions to check as well since it
          // will also be moving up.
          if(opposite && opposite.symbol === '[')
            nextPositions.push({y: nextPos.y-1, x: nextPos.x-1});
          else if(opposite && opposite.symbol === ']')
            nextPositions.push({y: nextPos.y-1, x: nextPos.x+1});
        }
        // If moving down
        else if(direction === 'v'){
          // Add the space below this to next positions array
          nextPositions.push({y: nextPos.y+1, x: nextPos.x});
          // If there is an opposite side of the box. Add that
          // to the next positions to check as well since it
          // will also be moving down.
          if(opposite && opposite.symbol === '[')
            nextPositions.push({y: nextPos.y+1, x: nextPos.x-1});
          else if(opposite && opposite.symbol === ']')
            nextPositions.push({y: nextPos.y+1, x: nextPos.x+1});
        }
        // If moving left
        else if(direction === '<'){
          // If the box is 2 wide move over by 2
          if(opposite)
            nextPositions.push({y: nextPos.y, x: nextPos.x-2});
          // Otherwise move over by just 1
          else
            nextPositions.push({y: nextPos.y, x: nextPos.x-1});
        }
        // If moving right
        else if(direction === '>'){
          // If the box is 2 wide move over by 2
          if(opposite)
            nextPositions.push({y: nextPos.y, x: nextPos.x+2});
          // Otherwise move over by just 1
          else
            nextPositions.push({y: nextPos.y, x: nextPos.x+1});
        }
      }
    }

    // If no walls were hit then move the boxes in the boxes to move array
    if(!hitWall){
      // Move boxes and location up
      if(direction === '^'){
        boxesToMove = boxesToMove.map((box) => ({y: box.y-1, x: box.x, symbol: box.symbol}));
        location.y--;
      }
      // Move boxes and location down
      else if(direction === 'v'){
        boxesToMove = boxesToMove.map((box) => ({y: box.y+1, x: box.x, symbol: box.symbol}));
        location.y++;
      }
      // Move boxes and location left
      else if(direction === '<'){
        boxesToMove = boxesToMove.map((box) => ({y: box.y, x: box.x-1, symbol: box.symbol}));
        location.x--;
      }
      // Move boxes and location right
      else if(direction === '>'){
        boxesToMove = boxesToMove.map((box) => ({y: box.y, x: box.x+1, symbol: box.symbol}));
        location.x++;
      }
    }

    // Add all boxes to move back into the Map of boxes
    boxesToMove.forEach((box) => boxes.set(`${box.y},${box.x}`, {y: box.y, x: box.x, symbol: box.symbol}));

  }

  // Display the final grids if that setting is on
  if(SHOW_FINAL_GRIDS)
    print(walls, boxes, location, message, height, width);

  // Calculate the total of the GPS coordinates
  let total = 0;
  Array.from(boxes.values())
    // Use only the left side of a double wide box or a single width box location
    .filter(box => box.symbol === '[' || box.symbol === 'O')
    .forEach((box) => { total += (100 * box.y) + box.x});
  return total;
}

const print = (walls, boxes, location, message, height, width) => {
  // Start the output with the message
  let output = message ? message + '\n' : '';
  // Parse rows until reaching the height
  for(let y = 0; y < height; y++){
    // Parse columns until reaching the width
    for(let x = 0; x < width; x++){
      // Icons to display on this tile
      let icons = []
      // Key for this location for set and map lookups
      let key = `${y},${x}`;

      // If there is a wall, box, or robot at this location
      // add their symbols to the icons array.
      if(walls.has(key))
        icons.push('#');
      if(boxes.has(key))
        icons.push(boxes.get(key).symbol);
      if(location.y == y && location.x == x)
        icons.push('@');

      // If there are no icons here print a . for empty space
      if(icons.length === 0)
        output += '.';
      // If there is only one icon print it
      else if(icons.length === 1)
        output += icons[0];
      // If more icons print the count of the number of icons.
      else
        output += icons.length;
    }
    // Add a newline at the end of each row
    output += '\n';
  }
  // Log the output to console
  console.log(output);
}


function parse(input) {
  const map = [];
  const instructions = [];
  const goods = [];
  let mapFilled = false;
  for (const line of input) {
    if (line === "") {
      mapFilled = true;
      continue;
    }
    if (!mapFilled) {
      map.push(line);
    } else {
      instructions.push(line);
    }
  }
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === "O") {
        goods.push({ x, y });
      }
    }
    map[y] = map[y].replaceAll("O", ".");
  }
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === "@") {
        map[y] = map[y].replace("@", ".");
        return { map, instructions: instructions.join(""), robot: { x, y }, goods, input };
      }
    }
  }
  return { map, instructions: instructions.join(""), goods };
}

module.exports = { A, B, parse };