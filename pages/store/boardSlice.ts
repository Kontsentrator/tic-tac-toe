import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ofType, StateObservable } from "redux-observable";
import { delay, delayWhen, first, map, mapTo, mergeMap, of, timer, takeWhile } from "rxjs";

interface IBoardSize {
  rowsCount: number;
  colsCount: number;
}

interface IBoardState {
  board: Array<string[]>;
  nextTurn: boolean;
  boardSize: IBoardSize;
  winner: string;
  gameNum: number;
  playerWinCount: number;
  botWinCount: number;
}

const initBoardSize: IBoardSize = {
  rowsCount: 3,
  colsCount: 3,
};

export const initialState: IBoardState = {
  board: Array(initBoardSize.rowsCount).fill(
    Array(initBoardSize.colsCount).fill("")
  ),
  nextTurn: true,
  boardSize: {
    rowsCount: initBoardSize.rowsCount,
    colsCount: initBoardSize.colsCount,
  },
  winner: "",
  gameNum: 0,
  playerWinCount: 0,
  botWinCount: 0,
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
      state.gameNum++;
    },
    setWinner: (state, action: PayloadAction<string>) => {
      state.winner = action.payload;
    },
    increasePlayerWinCount: (state) => {
      state.playerWinCount++;
    },
    increaseBotWinCount: (state) => {
      state.botWinCount++;
    },
  },
});

export const myMoveEpic = (actions$: any, state$: any) =>
  actions$.pipe(
    ofType("MY_MOVE"),
    // TakeWhile — делай ход ботом, пока нет победителя.
    // Здесь из state$.value ты можешь получить актуальное значение winner. Поэтому пока winner = '' бот будет ходить
    takeWhile(() => !state$.value.boardReducer.winner),
    delayWhen((action: any) => (!action.payload.isPlayer ? timer(1000) : timer(0))),
    map((action: any) => ({ type: move.type, payload: action.payload }))
  );

export const {
  move,
  restart,
  setWinner,
  increasePlayerWinCount,
  increaseBotWinCount,
} = boardSlice.actions;
export default boardSlice.reducer;
