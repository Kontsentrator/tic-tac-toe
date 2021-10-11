import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IBoardState {
  board: Array<string[]>;
  nextTurn: boolean;
}

export const initialState: IBoardState = {
  board: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
  nextTurn: true,
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
    },
  },
});

export const { move, restart } = boardSlice.actions;
export default boardSlice.reducer;
