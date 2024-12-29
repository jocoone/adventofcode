function A(plots) {
  return plots.map(({area, perimeter}) => area * perimeter).reduce((acc, curr) => acc + curr, 0);
}

function B(plots) {
  return plots.map(({area, corners}) => area * corners).reduce((acc, curr) => acc + curr, 0);
}

function findPlots(data) {
  let regions = [];
  let outRegionPositions = [{y: 0, x: 0}];
  let visited = new Set();

  while(outRegionPositions.length > 0){
    let start = outRegionPositions.shift();

    if(visited.has(`${start.y},${start.x}`))
      continue;

    let area = 0;
    let perimeter = 0;
    let spaces = new Map()
    let inRegionPositions = [start];
    let regionLetter = data[start.y][start.x];

    while(inRegionPositions.length > 0){
      let current = inRegionPositions.shift();
      if(visited.has(`${current.y},${current.x}`))
        continue;

      let adjacent = [
        {y: current.y-1, x: current.x}, // up
        {y: current.y+1, x: current.x}, // down
        {y: current.y, x: current.x-1}, // left
        {y: current.y, x: current.x+1}, // right
      ].filter((val) => inGrid(val, data));
      let inRegionAdjacent = 0
      adjacent.forEach((val) => {
        if(data[val.y][val.x] === regionLetter){
          inRegionAdjacent++;
          inRegionPositions.push(val);
        }
        else{
          outRegionPositions.push(val);
        }
      });
      let edges = 4 - inRegionAdjacent;
      perimeter += edges;
      area++;

      spaces.set(`${current.y},${current.x}`, {y: current.y, x: current.x, edges});
      visited.add(`${current.y},${current.x}`);
    }

    let corners = 0;
    let spacesArr = Array.from(spaces.values());
    for(let space of spacesArr){
      let hasUp = spaces.has(`${space.y-1},${space.x}`);
      let hasDown = spaces.has(`${space.y+1},${space.x}`)
      let hasLeft = spaces.has(`${space.y},${space.x-1}`);
      let hasRight = spaces.has(`${space.y},${space.x+1}`);
      let hasUpperRight = spaces.has(`${space.y-1},${space.x+1}`);
      let hasLowerRight = spaces.has(`${space.y+1},${space.x+1}`)
      let hasLowerLeft = spaces.has(`${space.y+1},${space.x-1}`);
      let hasUpperLeft = spaces.has(`${space.y-1},${space.x-1}`);
      let inBoundsUpperRight = inGrid({y: space.y-1, x: space.x+1}, data);
      let inBoundsLowerRight = inGrid({y: space.y+1, x: space.x+1}, data);
      let inBoundsLowerLeft = inGrid({y: space.y+1, x: space.x-1}, data);
      let inBoundsUpperLeft = inGrid({y: space.y-1, x: space.x-1}, data);

      if(space.edges === 4)
        corners += 4;
      else if(space.edges === 3)
        corners += 2;
      else if(space.edges === 2){
        if(hasUp && hasRight){
          if(hasUpperRight)
            corners += 1;
          else
            corners += 2;
        }
        else if(hasRight && hasDown){
          if(hasLowerRight)
            corners += 1;
          else
            corners += 2;
        }
        else if(hasDown && hasLeft){
          if(hasLowerLeft)
            corners += 1;
          else
            corners += 2;
        }
        else if(hasLeft && hasUp){
          if(hasUpperLeft)
            corners += 1;
          else
            corners += 2;
        }
      }
      else if(space.edges === 1){
        if(hasLeft && hasDown && hasRight){
          if(!hasLowerRight && inBoundsLowerRight)
            corners += 1;
          if(!hasLowerLeft && inBoundsLowerLeft)
            corners += 1;
        }
        else if(hasLeft && hasDown && hasUp){
          if(!hasUpperLeft && inBoundsUpperLeft)
            corners += 1;
          if(!hasLowerLeft && inBoundsLowerLeft)
            corners += 1;
        }
        else if(hasLeft && hasUp && hasRight){
          if(!hasUpperRight && inBoundsUpperRight)
            corners += 1;
          if(!hasUpperLeft && inBoundsUpperLeft)
            corners += 1;
        }
        else if(hasUp && hasDown && hasRight){
          if(!hasLowerRight && inBoundsLowerRight)
            corners += 1;
          if(!hasUpperRight && inBoundsUpperRight)
            corners += 1;
        }
      }
      else if(space.edges === 0){
        if(!hasLowerRight && inBoundsLowerRight)
          corners += 1;
        if(!hasLowerLeft && inBoundsLowerLeft)
          corners += 1;
        if(!hasUpperRight && inBoundsUpperRight)
          corners += 1;
        if(!hasUpperLeft && inBoundsUpperLeft)
          corners += 1;
      }
    }
    regions.push({area, perimeter, corners});
  }
  return regions;
}

const inGrid = (val, data) => {
  return val.y >= 0 &&
    val.y < data.length &&
    val.x >= 0 &&
    val.x < data[val.y].length;
}

function parse(input) {
  return findPlots(input.map(line => line.split("")));
}

module.exports = { A, B, parse };