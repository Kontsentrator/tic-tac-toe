

export const checkWinner = (flag: string, board: string[][]) => {
  if ((checkLines(flag) || checkDiagonals(flag)) && !winner) {
    return true;
  }
  return false;
};

const checkLines = (flag: string): boolean => {
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

const checkDiagonals = (flag: string): boolean => {
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
