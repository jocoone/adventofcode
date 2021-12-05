function A({ draws, boards }) {
  let winninboard;
  for (let draw of draws) {
    for (let board of boards) {
      let stop = false;
      for (let row of board) {
        for (let i = 0; i < row.length; i++) {
          if (row[i] === draw) {
            row[i] = 'X';
            stop = true;
            break;
          }
        }
        if (stop) {
          break;
        }
      }
      if (validateBoardColumns(board) || validateBoardRows(board)) {
        winninboard = board;
        return calculateScore(draw, board);
      }
    }
  }
}

function B({ draws, boards }, answerA) {
  const scores = [answerA];
  let usingBoards = [...boards];
  do {
    usingBoards = usingBoards.filter(
      (board) => !validateBoardColumns(board) && !validateBoardRows(board)
    );
    scores.push(A({ draws, boards: usingBoards }));
  } while (scores.length != boards.length);
  return scores[scores.length - 1];
}

function calculateScore(winningDraw, board) {
  return (
    board.reduce(
      (prev, row) =>
        prev +
        row
          .map(Number)
          .filter(isFinite)
          .reduce((p, val) => p + val, 0),
      0
    ) * Number(winningDraw)
  );
}

function validateBoardRows(board) {
  for (let row of board) {
    if (row.filter((x) => x != 'X').length === 0) {
      return true;
    }
  }
  return false;
}

function validateBoardColumns(board) {
  for (let i = 0; i < 5; i++) {
    const column = board.map((row) => row[i]);
    if (column.filter((x) => x != 'X').length === 0) {
      return true;
    }
  }

  return false;
}

function parse(input) {
  const draws = input[0].split(',');
  const boards = [];
  for (let i = 2; i < input.length; i += 6) {
    const board = [];
    for (let r = 0; r < 5; r++) {
      const row = [];
      input[i + r]
        .split(' ')
        .filter((x) => !!x)
        .forEach((x) => row.push(x));
      board.push(row);
    }
    boards.push(board);
  }
  return {
    draws,
    boards,
  };
}

module.exports = { A, B, parse };
