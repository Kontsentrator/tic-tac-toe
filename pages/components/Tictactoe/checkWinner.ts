export const checkWinner = (flag: string, board: string[][]) => {
  if (checkLines(flag, board) || checkDiagonals(flag, board)) {
    return true;
  }
  return false;
};

const checkLines = (flag: string, board: string[][]): boolean => {
  let rowsCount = board.length,
    colsCount = board[0].length;

  for (let row = 0; row < rowsCount; row++) {
    let rowCheck = true,
      colCheck = true;
    for (let col = 0; col < colsCount; col++) {
      rowCheck &&= board[row][col] === flag;
      colCheck &&= board[col][row] === flag;
    }

    if (rowCheck || colCheck) {
      return true;
    }
  }
  return false;
};

const checkDiagonals = (flag: string, board: string[][]): boolean => {
  let rowsCount = board.length;

  let toRight = true,
    toLeft = true;
  for (let row = 0; row < rowsCount; row++) {
    toRight &&= board[row][row] === flag;
    toLeft &&= board[rowsCount - 1 - row][row] === flag;
  }

  if (toRight || toLeft) {
    return true;
  }
  return false;
};
