import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ofType } from "redux-observable";
import { map, filter, delay } from "rxjs";
import { IMoveInfo, History, IStatistic } from "../interfaces/interface";

const flags = { player: "x", bot: "o" };

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
  currentMoveInfo: IMoveInfo;
  statistic: IStatistic;
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

const initStatistic: IStatistic = {
  botWinCount: 0,
  playerWinCount: 0,
  history: [[]],
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
  currentMoveInfo: initCurrentMoveInfo,
  statistic: initStatistic,
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    playerMove: (
      state,
      action: PayloadAction<{ flag: string; row: number; col: number }>
    ) => {
      state.board[action.payload.row][action.payload.col] = flags.player;
      state.nextTurn = !state.nextTurn;
      state.currentMoveInfo = {
        row: action.payload.row,
        col: action.payload.col,
        isPlayer: true,
      };
    },
    botMove: (state) => {
      const random = (min: number, max: number): number => {
        return min + Math.random() * (max - min);
      };
      let randRow, randCol;
      do {
        randRow = Math.round(random(0, initBoardSize.rowsCount - 1));
        randCol = Math.round(random(0, initBoardSize.colsCount - 1));
      } while (state.board[randRow][randCol] !== "");

      state.board[randRow][randCol] = flags.bot;
      state.nextTurn = !state.nextTurn;
      state.currentMoveInfo = { row: randRow, col: randCol, isPlayer: false };
    },
    restart: (state) => {
      state.board = initialState.board;
      state.nextTurn = initialState.nextTurn;
      state.winner = initialState.winner;
      state.gameNum++;
      state.currentMoveInfo = initialState.currentMoveInfo;
      state.statistic.history.push([]);
    },
    setWinner: (state, action: PayloadAction<string>) => {
      state.winner = action.payload;
    },
    setCurrentMoveInfo: (state, action: PayloadAction<IMoveInfo>) => {
      state.currentMoveInfo = action.payload;
    },
    addHistory: (state) => {
      state.statistic.history[state.gameNum].push(state.currentMoveInfo);
    },
    setHistory: (state, action: PayloadAction<History>) => {},
    increaseBotWinCount: (state) => {
      state.statistic.botWinCount++;
    },
    increasePlayerWinCount: (state) => {
      state.statistic.playerWinCount++;
    },
  },
});

export const playerMoveEpic = (actions$: any, state$: any) =>
  actions$.pipe(
    ofType("PLAYER_MOVE"),
    filter((action: any) => {
      const winner = state$.value.boardReducer.winner;
      const nextTurn = state$.value.boardReducer.nextTurn;
      const board = state$.value.boardReducer.board;

      return (
        !winner && nextTurn && !board[action.payload.row][action.payload.col]
      );
    }),
    map((action: any) => ({ type: playerMove.type, payload: action.payload }))
  );

export const botMoveEpic = (actions$: any, state$: any) =>
  actions$.pipe(
    ofType("BOT_MOVE"),
    filter((action: any) => {
      const winner = state$.value.boardReducer.winner;
      const nextTurn = state$.value.boardReducer.nextTurn;
      const board = state$.value.boardReducer.board;

      if (winner === flags.bot) {
        action.payload.setStatistic((prevState: any) => ({
          ...prevState,
          bot: state$.value.boardReducer.statistic.botWinCount,
        }));
      }

      if (winner === flags.player) {
        action.payload.setStatistic((prevState: any) => ({
          ...prevState,
          player: state$.value.boardReducer.statistic.playerWinCount,
        }));
      }

      // Проверка, что на поле остались пустые клетки
      const hasEmptyCells = (array: string[][]): boolean => {
        return !array.every((row) => row.every((el) => el !== ""));
      };

      return !winner && !nextTurn && hasEmptyCells(board);
    }),
    delay(200),
    map((action: any) => ({ type: botMove.type, payload: action.payload }))
  );

export const setMoveInfoEpic = (actions$: any, state$: any) =>
  actions$.pipe(
    ofType("SET_MOVE_INFO"),
    filter(() => !state$.value.boardReducer.winner),
    map((action: any) => ({
      type: setCurrentMoveInfo.type,
      payload: action.payload,
    }))
  );

export const saveStatisticEpic = (actions$: any, state$: any) =>
  actions$.pipe(
    ofType("SAVE_STATISTIC"),
    filter((action: any) => {
      const winner = state$.value.boardReducer.winner;
      if (!winner) {
        action.payload.saveStatistic(state$.value.boardReducer.statistic);
      }

      return !winner;
    }),
    map((action: any) => ({
      type: setHistory.type,
      payload: action.payload.statistic.history,
    }))
  );

export const {
  playerMove,
  botMove,
  restart,
  setWinner,
  setCurrentMoveInfo,
  addHistory,
  setHistory,
  increaseBotWinCount,
  increasePlayerWinCount,
} = boardSlice.actions;
export default boardSlice.reducer;
