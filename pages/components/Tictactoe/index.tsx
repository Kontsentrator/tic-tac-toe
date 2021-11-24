import React, { memo, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Cell from "../Cell";
import StatisticMenu from "../StatisticMenu";
import styles from "./tictactoe.module.scss";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  initialState,
  move,
  restart,
  setWinner,
  increasePlayerWinCount,
  increaseBotWinCount,
  setCurrentMoveInfo,
} from "../../store/boardSlice";

import { IMoveInfo, IStatistic } from "../../interfaces/interface";
import { statistic } from "../../data/statistic";

const TicTacToe = () => {
  // Состояния
  const [error, setError] = useState<Error>();

  // Метки полей
  const flags = { player: "x", bot: "o" };

  // Данный из стейта
  const currentMoveInfo = useAppSelector(
    (state) => state.boardReducer.currentMoveInfo
  );
  const gameNum = useAppSelector((state) => state.boardReducer.gameNum);
  const board = useAppSelector((state) => state.boardReducer.board);
  const nextTurn = useAppSelector((state) => state.boardReducer.nextTurn);
  const winner = useAppSelector((state) => state.boardReducer.winner);
  const rowsCount = useAppSelector(
    (state) => state.boardReducer.boardSize.rowsCount
  );
  const colsCount = useAppSelector(
    (state) => state.boardReducer.boardSize.colsCount
  );
  const playerWinCount = useAppSelector(
    (state) => state.boardReducer.playerWinCount
  );
  const botWinCount = useAppSelector((state) => state.boardReducer.botWinCount);

  statistic.botWinCount = botWinCount;
  statistic.playerWinCount = playerWinCount;

  while (statistic.history.length <= gameNum) {
    statistic.history.push([]);
  }

  const dispatch = useAppDispatch();

  const makeMove = useCallback(
    (flag: string, row: number, col: number) => {
      console.log("Next turn", nextTurn);
      dispatch({
        type: "MY_MOVE",
        payload: { flag: flag, row: row, col: col, isPlayer: nextTurn },
      });
      dispatch({
        type: "MY_MOVE_INFO",
        payload: { row: row, col: col, isPlayer: nextTurn },
      });
    },
    [nextTurn, dispatch]
  );

  const checkWinner = (flag: string) => {
    console.log("check winner", winner);
    if ((checkLines(flag) || checkDiagonals(flag)) && !winner) {
      return true;
    }
    return false;
  };

  // -------------- Эффекты -------------

  // Сохранение статистики
  useEffect(() => {
    if (
      currentMoveInfo &&
      currentMoveInfo.col !== initialState.currentMoveInfo.col &&
      currentMoveInfo.row !== initialState.currentMoveInfo.row &&
      !statistic.history[gameNum].find((el) => el === currentMoveInfo)
    ) {
      statistic.history[gameNum].push(currentMoveInfo);
    }
    if (!winner) saveStatistic(statistic);
  }, [currentMoveInfo, gameNum, winner]);

  // Проверка победителя
  useEffect(() => {
    let flag = nextTurn ? flags.bot : flags.player;
    if (checkWinner(flag)) {
      dispatch({ type: setWinner.type, payload: flag });

      if (flag == flags.player) {
        dispatch({ type: increasePlayerWinCount.type });
      } else {
        dispatch({ type: increaseBotWinCount.type });
      }
    }
  }, [board, nextTurn, checkWinner]);

  // Ход бота
  useEffect(() => {
    const botMove = () => {
      if (!winner && !nextTurn && hasEmptyCells(board)) {
        console.log("Hod bota");
        let randRow, randCol;
        do {
          randRow = Math.round(random(0, rowsCount - 1));
          randCol = Math.round(random(0, colsCount - 1));
        } while (board[randRow][randCol] !== "");
        makeMove(flags.bot, randRow, randCol);
      }
    };

    botMove();
  }, [nextTurn, winner, board]);

  // -------------- Методы -------------

  // Проверка, что на поле остались пустые клетки
  const hasEmptyCells = (array: string[][]): boolean => {
    return !array.every((row) => row.every((el) => el !== ""));
  };

  // Вывод случайного числа
  const random = (min: number, max: number): number => {
    return min + Math.random() * (max - min);
  };

  const checkLines = (flag: string): boolean => {
    for (let row = 0; row < rowsCount; row++) {
      let rowCheck = true;
      let colCheck = true;
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
    let toRight = true;
    let toLeft = true;
    for (let row = 0; row < rowsCount; row++) {
      toRight &&= board[row][row] === flag;
      toLeft &&= board[rowsCount - 1 - row][row] === flag;
    }

    if (toRight || toLeft) {
      return true;
    }
    return false;
  };

  // Обработка клика по клетке поля
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!winner && nextTurn && !board[row][col]) {
        makeMove(flags.player, row, col);
      }
    },
    [winner, nextTurn, board]
  );

  // Cохранение информации о ходе
  const saveStatistic = async (stat: IStatistic) => {
    await fetch("http://localhost:3000/api/board", {
      method: "POST",
      body: JSON.stringify({ stat }),
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((error) => setError(error));
  };

  // Перезапуск игры
  const restartGame = () => {
    dispatch({ type: restart.type });
  };

  return (
    <div className={styles.game}>
      <p>{initialState.nextTurn ? "Вы ходите первым" : "Вы ходите вторым"}</p>
      <p>Игра №{gameNum + 1}</p>
      <div className={styles.game__board}>
        {board.map((row, rowNum) => (
          <div className={styles.game__row} key={rowNum}>
            {row.map((col, colNum) => (
              <Cell
                key={colNum}
                className={styles.game__cell}
                row={rowNum}
                col={colNum}
                onClick={handleCellClick}
                value={col}
              />
            ))}
          </div>
        ))}
      </div>

      {winner == flags.bot ? (
        <div className={styles.game__botWin}>Проигрыш</div>
      ) : (
        winner == flags.player && (
          <div className={styles.game__playerWin}>Победа</div>
        )
      )}

      <button className={styles.game__buttonRestart} onClick={restartGame}>
        Начать заново
      </button>
      {error && <div className="error">{error}</div>}

      <Link href="/history">
        <a className={styles.game__nav} href="">
          История ходов
        </a>
      </Link>

      <StatisticMenu className={styles.game__statisticMenu} />
    </div>
  );
};

export default memo(TicTacToe);
