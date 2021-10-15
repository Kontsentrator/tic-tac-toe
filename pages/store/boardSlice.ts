import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IBoardSize {
  rowsNum: number;
  colsNum: number;
}

interface IBoardState {
  board: Array<string[]>;
  nextTurn: boolean;
  boardSize: IBoardSize;
  winner: string;
}

const initBoardSize: IBoardSize = {
  rowsNum: 3,
  colsNum: 3,
};

export const initialState: IBoardState = {
  board: Array(initBoardSize.rowsNum).fill(
    Array(initBoardSize.colsNum).fill("")
  ),
  nextTurn: true,
  boardSize: {
    rowsNum: initBoardSize.rowsNum,
    colsNum: initBoardSize.colsNum,
  },
  winner: "",
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    move: (
      state,
      action: PayloadAction<{ flag: string; row: number; col: number }>
    ) => {
      state.board[action.payload.row][action.payload.col] = action.payload.flag;
      state.nextTurn = !state.nextTurn;
    },
    restart: (state) => {
      state.board = initialState.board;
      state.nextTurn = initialState.nextTurn;
      state.winner = initialState.winner;
    },
    setWinner: (state, action: PayloadAction<string>) => {
      state.winner = action.payload;
    },
  },
});

export const { move, restart, setWinner } = boardSlice.actions;
export default boardSlice.reducer;
