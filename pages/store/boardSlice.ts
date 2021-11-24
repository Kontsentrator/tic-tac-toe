import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ofType } from "redux-observable";
import { delayWhen, map, timer, filter } from "rxjs";
import { IMoveInfo } from "../interfaces/interface";

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
  currentMoveInfo: IMoveInfo;
}

const initBoardSize: IBoardSize = {
  rowsCount: 3,
  colsCount: 3,
};

const initCurrentMoveInfo: IMoveInfo = {
  row: -1,
  col: -1,
  isPlayer: false,
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
  currentMoveInfo: initCurrentMoveInfo,
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
      state.currentMoveInfo = initialState.currentMoveInfo;
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
    setCurrentMoveInfo: (state, action: PayloadAction<IMoveInfo>) => {
      state.currentMoveInfo = action.payload;
    },
  },
});

export const myMoveEpic = (actions$: any, state$: any) =>
  actions$.pipe(
    ofType("MY_MOVE"),
    filter(() => !state$.value.boardReducer.winner),
    delayWhen((action: any) =>
      !action.payload.isPlayer ? timer(200) : timer(0)
    ),
    map((action: any) => ({ type: move.type, payload: action.payload }))
  );

export const myMoveInfoEpic = (actions$: any, state$: any) =>
  actions$.pipe(
    ofType("MY_MOVE_INFO"),
    filter(() => !state$.value.boardReducer.winner),
    map((action: any) => ({
      type: setCurrentMoveInfo.type,
      payload: action.payload,
    }))
  );

export const {
  move,
  restart,
  setWinner,
  increasePlayerWinCount,
  increaseBotWinCount,
  setCurrentMoveInfo,
} = boardSlice.actions;
export default boardSlice.reducer;
